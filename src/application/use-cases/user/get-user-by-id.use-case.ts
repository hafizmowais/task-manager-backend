import { Inject, Injectable } from '@nestjs/common';
import { GetUserByIdPort } from '../../ports/inbound/user.port';
import {
  UserRepositoryPort,
  USER_REPOSITORY_PORT,
} from '../../ports/outbound/user-repository.port';
import { User } from '../../../domain/entities/user.entity';
import { EntityNotFoundException } from '../../../domain/exceptions/domain.exception';

/**
 * Use case for getting a user by ID
 */
@Injectable()
export class GetUserByIdUseCase implements GetUserByIdPort {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new EntityNotFoundException('User', id);
    }
    return user;
  }
}

