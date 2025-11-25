import { Inject, Injectable } from '@nestjs/common';
import { EditTaskPort } from '../../ports/inbound/task.port';
import {
  TaskRepositoryPort,
  TASK_REPOSITORY_PORT,
} from '../../ports/outbound/task-repository.port';
import { Task } from '../../../domain/entities/task.entity';
import { EntityNotFoundException } from '../../../domain/exceptions/domain.exception';

/**
 * Use case for editing an existing task
 */
@Injectable()
export class EditTaskUseCase implements EditTaskPort {
  constructor(
    @Inject(TASK_REPOSITORY_PORT)
    private readonly taskRepository: TaskRepositoryPort,
  ) {}

  async execute(
    id: string,
    title?: string,
    description?: string,
    dueDate?: Date | null,
  ): Promise<Task> {
    // Find existing task
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new EntityNotFoundException('Task', id);
    }

    // Update task using domain method
    task.update(title, description, dueDate);

    // Persist changes
    return this.taskRepository.save(task);
  }
}

