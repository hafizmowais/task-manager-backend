import { Inject, Injectable } from '@nestjs/common';
import { GetTaskByIdPort } from '../../ports/inbound/task.port';
import {
  TaskRepositoryPort,
  TASK_REPOSITORY_PORT,
} from '../../ports/outbound/task-repository.port';
import { Task } from '../../../domain/entities/task.entity';
import { EntityNotFoundException } from '../../../domain/exceptions/domain.exception';

/**
 * Use case for getting a task by ID
 */
@Injectable()
export class GetTaskByIdUseCase implements GetTaskByIdPort {
  constructor(
    @Inject(TASK_REPOSITORY_PORT)
    private readonly taskRepository: TaskRepositoryPort,
  ) {}

  async execute(id: string): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new EntityNotFoundException('Task', id);
    }
    return task;
  }
}

