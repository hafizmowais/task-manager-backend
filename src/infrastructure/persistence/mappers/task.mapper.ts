import { Task, TaskStatus } from '../../../domain/entities/task.entity';
import { TaskEntity } from '../entities/task.entity';

/**
 * Mapper to convert between domain Task and persistence TaskEntity
 */
export class TaskMapper {
  /**
   * Convert domain Task to persistence TaskEntity
   */
  static toPersistence(task: Task): TaskEntity {
    const entity = new TaskEntity();
    entity.id = task.id;
    entity.title = task.title;
    entity.description = task.description;
    entity.status = task.status;
    entity.dueDate = task.dueDate;
    entity.assignedTo = task.assignedTo;
    entity.createdAt = task.createdAt;
    entity.updatedAt = task.updatedAt;
    return entity;
  }

  /**
   * Convert persistence TaskEntity to domain Task
   */
  static toDomain(entity: TaskEntity): Task {
    return new Task(
      entity.id,
      entity.title,
      entity.description,
      entity.status as TaskStatus,
      entity.dueDate,
      entity.assignedTo,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}

