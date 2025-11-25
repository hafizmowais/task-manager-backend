import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { UserEntity } from './entities/user.entity';
import { TaskRepository } from './repositories/task.repository';
import { UserRepository } from './repositories/user.repository';
import { TASK_REPOSITORY_PORT } from '../../application/ports/outbound/task-repository.port';
import { USER_REPOSITORY_PORT } from '../../application/ports/outbound/user-repository.port';

/**
 * Persistence module - provides repository implementations
 */
@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, UserEntity])],
  providers: [
    {
      provide: TASK_REPOSITORY_PORT,
      useClass: TaskRepository,
    },
    {
      provide: USER_REPOSITORY_PORT,
      useClass: UserRepository,
    },
  ],
  exports: [TASK_REPOSITORY_PORT, USER_REPOSITORY_PORT],
})
export class PersistenceModule {}

