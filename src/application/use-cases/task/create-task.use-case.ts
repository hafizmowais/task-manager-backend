import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskPort } from '../../ports/inbound/task.port';
import {
  TaskRepositoryPort,
  TASK_REPOSITORY_PORT,
} from '../../ports/outbound/task-repository.port';
import { Task } from '../../../domain/entities/task.entity';
import { v4 as uuidv4 } from 'uuid';
import { ValidationException } from '../../../domain/exceptions/domain.exception';

/**
 * Use case for creating a new task
 */
@Injectable()
export class CreateTaskUseCase implements CreateTaskPort {
  constructor(
    @Inject(TASK_REPOSITORY_PORT)
    private readonly taskRepository: TaskRepositoryPort,
  ) {}

  async execute(
    title: string,
    description: string,
    dueDate?: Date | null,
  ): Promise<Task> {
    // Validate inputs
    if (!title || title.trim().length === 0) {
      throw new ValidationException('Task title cannot be empty');
    }

    if (!description || description.trim().length === 0) {
      throw new ValidationException('Task description cannot be empty');
    }

    // Create domain entity
    const task = Task.create(uuidv4(), title, description, dueDate || null);

    // Persist via repository
    return this.taskRepository.save(task);
  }
}

