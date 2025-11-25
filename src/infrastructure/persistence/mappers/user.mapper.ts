import { User } from '../../../domain/entities/user.entity';
import { UserEntity } from '../entities/user.entity';

/**
 * Mapper to convert between domain User and persistence UserEntity
 */
export class UserMapper {
  /**
   * Convert domain User to persistence UserEntity
   */
  static toPersistence(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.name = user.name;
    entity.email = user.email;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    return entity;
  }

  /**
   * Convert persistence UserEntity to domain User
   */
  static toDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.name,
      entity.email,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}

