import { Inject, Injectable } from '@nestjs/common';
import { DeleteTaskPort } from '../../ports/inbound/task.port';
import {
  TaskRepositoryPort,
  TASK_REPOSITORY_PORT,
} from '../../ports/outbound/task-repository.port';
import { EntityNotFoundException } from '../../../domain/exceptions/domain.exception';

/**
 * Use case for deleting a task
 */
@Injectable()
export class DeleteTaskUseCase implements DeleteTaskPort {
  constructor(
    @Inject(TASK_REPOSITORY_PORT)
    private readonly taskRepository: TaskRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    // Check if task exists
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new EntityNotFoundException('Task', id);
    }

    // Delete task
    await this.taskRepository.delete(id);
  }
}

