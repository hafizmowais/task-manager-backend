import { Inject, Injectable } from '@nestjs/common';
import { UpdateTaskStatusPort } from '../../ports/inbound/task.port';
import {
  TaskRepositoryPort,
  TASK_REPOSITORY_PORT,
} from '../../ports/outbound/task-repository.port';
import { Task, TaskStatus } from '../../../domain/entities/task.entity';
import {
  EntityNotFoundException,
  ValidationException,
} from '../../../domain/exceptions/domain.exception';

/**
 * Use case for updating task status
 */
@Injectable()
export class UpdateTaskStatusUseCase implements UpdateTaskStatusPort {
  constructor(
    @Inject(TASK_REPOSITORY_PORT)
    private readonly taskRepository: TaskRepositoryPort,
  ) {}

  async execute(id: string, status: string): Promise<Task> {
    // Find task
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new EntityNotFoundException('Task', id);
    }

    // Validate status
    if (!Object.values(TaskStatus).includes(status as TaskStatus)) {
      throw new ValidationException(
        `Invalid status: ${status}. Must be one of: ${Object.values(TaskStatus).join(', ')}`,
      );
    }

    // Update status
    task.updateStatus(status as TaskStatus);

    // Persist changes
    return this.taskRepository.save(task);
  }
}

