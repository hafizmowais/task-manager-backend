import { Task } from '../../../domain/entities/task.entity';

/**
 * Outbound port for task repository
 * This interface defines the contract that any task persistence adapter must implement
 */
export interface TaskRepositoryPort {
  /**
   * Find all tasks
   */
  findAll(): Promise<Task[]>;

  /**
   * Find a task by ID
   */
  findById(id: string): Promise<Task | null>;

  /**
   * Save a task (create or update)
   */
  save(task: Task): Promise<Task>;

  /**
   * Delete a task by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Find tasks by assigned user ID
   */
  findByAssignedTo(userId: string): Promise<Task[]>;
}

export const TASK_REPOSITORY_PORT = Symbol('TASK_REPOSITORY_PORT');

