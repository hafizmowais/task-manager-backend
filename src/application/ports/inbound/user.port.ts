import { User } from '../../../domain/entities/user.entity';

/**
 * Inbound port for listing users
 */
export interface ListUsersPort {
  execute(): Promise<User[]>;
}

export const LIST_USERS_PORT = Symbol('LIST_USERS_PORT');

/**
 * Inbound port for creating a user
 */
export interface CreateUserPort {
  execute(name: string, email: string): Promise<User>;
}

export const CREATE_USER_PORT = Symbol('CREATE_USER_PORT');

/**
 * Inbound port for getting a user by ID
 */
export interface GetUserByIdPort {
  execute(id: string): Promise<User>;
}

export const GET_USER_BY_ID_PORT = Symbol('GET_USER_BY_ID_PORT');

