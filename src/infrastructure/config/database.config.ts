import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TaskEntity } from '../persistence/entities/task.entity';
import { UserEntity } from '../persistence/entities/user.entity';

/**
 * Database configuration for TypeORM
 */
export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'taskmanager',
  password: process.env.DATABASE_PASSWORD || 'taskmanager',
  database: process.env.DATABASE_NAME || 'taskmanager_db',
  entities: [TaskEntity, UserEntity],
  // Never enable synchronize in production - it can cause data loss
  // In production, synchronize is always false regardless of DATABASE_SYNCHRONIZE env var
  // In non-production, synchronize is enabled by default unless explicitly set to 'false'
  synchronize: process.env.NODE_ENV !== 'production' && process.env.DATABASE_SYNCHRONIZE !== 'false',
  logging: process.env.NODE_ENV === 'development',
};

