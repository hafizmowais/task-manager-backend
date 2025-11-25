import { User } from '../../../domain/entities/user.entity';

/**
 * Outbound port for user repository
 * This interface defines the contract that any user persistence adapter must implement
 */
export interface UserRepositoryPort {
  /**
   * Find all users
   */
  findAll(): Promise<User[]>;

  /**
   * Find a user by ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Save a user (create or update)
   */
  save(user: User): Promise<User>;

  /**
   * Delete a user by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Find a user by email
   */
  findByEmail(email: string): Promise<User | null>;
}

export const USER_REPOSITORY_PORT = Symbol('USER_REPOSITORY_PORT');

