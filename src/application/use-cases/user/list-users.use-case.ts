import { Inject, Injectable } from '@nestjs/common';
import { ListUsersPort } from '../../ports/inbound/user.port';
import {
  UserRepositoryPort,
  USER_REPOSITORY_PORT,
} from '../../ports/outbound/user-repository.port';
import { User } from '../../../domain/entities/user.entity';

/**
 * Use case for listing all users
 */
@Injectable()
export class ListUsersUseCase implements ListUsersPort {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}

