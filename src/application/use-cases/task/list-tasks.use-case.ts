import { Inject, Injectable } from '@nestjs/common';
import { ListTasksPort } from '../../ports/inbound/task.port';
import {
  TaskRepositoryPort,
  TASK_REPOSITORY_PORT,
} from '../../ports/outbound/task-repository.port';
import { Task } from '../../../domain/entities/task.entity';

/**
 * Use case for listing all tasks
 */
@Injectable()
export class ListTasksUseCase implements ListTasksPort {
  constructor(
    @Inject(TASK_REPOSITORY_PORT)
    private readonly taskRepository: TaskRepositoryPort,
  ) {}

  async execute(): Promise<Task[]> {
    return this.taskRepository.findAll();
  }
}

