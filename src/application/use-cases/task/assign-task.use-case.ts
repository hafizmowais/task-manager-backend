import { Inject, Injectable } from '@nestjs/common';
import { AssignTaskPort } from '../../ports/inbound/task.port';
import {
  TaskRepositoryPort,
  TASK_REPOSITORY_PORT,
} from '../../ports/outbound/task-repository.port';
import {
  UserRepositoryPort,
  USER_REPOSITORY_PORT,
} from '../../ports/outbound/user-repository.port';
import { Task } from '../../../domain/entities/task.entity';
import { EntityNotFoundException } from '../../../domain/exceptions/domain.exception';

/**
 * Use case for assigning a task to a user
 */
@Injectable()
export class AssignTaskUseCase implements AssignTaskPort {
  constructor(
    @Inject(TASK_REPOSITORY_PORT)
    private readonly taskRepository: TaskRepositoryPort,
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(taskId: string, userId: string): Promise<Task> {
    // Find task
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new EntityNotFoundException('Task', taskId);
    }

    // Find user
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new EntityNotFoundException('User', userId);
    }

    // Assign task to user
    task.assignTo(userId);

    // Persist changes
    return this.taskRepository.save(task);
  }
}

