import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskRepositoryPort } from '../../../application/ports/outbound/task-repository.port';
import { Task } from '../../../domain/entities/task.entity';
import { TaskEntity } from '../entities/task.entity';
import { TaskMapper } from '../mappers/task.mapper';

/**
 * TypeORM implementation of TaskRepositoryPort
 */
@Injectable()
export class TaskRepository implements TaskRepositoryPort {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly repository: Repository<TaskEntity>,
  ) {}

  async findAll(): Promise<Task[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => TaskMapper.toDomain(entity));
  }

  async findById(id: string): Promise<Task | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? TaskMapper.toDomain(entity) : null;
  }

  async save(task: Task): Promise<Task> {
    const entity = TaskMapper.toPersistence(task);
    const saved = await this.repository.save(entity);
    return TaskMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByAssignedTo(userId: string): Promise<Task[]> {
    const entities = await this.repository.find({ where: { assignedTo: userId } });
    return entities.map((entity) => TaskMapper.toDomain(entity));
  }
}

