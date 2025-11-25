import { Inject, Injectable } from '@nestjs/common';
import { CreateUserPort } from '../../ports/inbound/user.port';
import {
  UserRepositoryPort,
  USER_REPOSITORY_PORT,
} from '../../ports/outbound/user-repository.port';
import { User } from '../../../domain/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { ValidationException } from '../../../domain/exceptions/domain.exception';

/**
 * Use case for creating a new user
 */
@Injectable()
export class CreateUserUseCase implements CreateUserPort {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(name: string, email: string): Promise<User> {
    // Validate inputs
    if (!name || name.trim().length === 0) {
      throw new ValidationException('User name cannot be empty');
    }

    if (!email || email.trim().length === 0) {
      throw new ValidationException('User email cannot be empty');
    }

    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ValidationException(`User with email ${email} already exists`);
    }

    // Create domain entity
    const user = User.create(uuidv4(), name, email);

    // Validate email format
    if (!user.hasValidEmail()) {
      throw new ValidationException('Invalid email format');
    }

    // Persist via repository
    return this.userRepository.save(user);
  }
}

