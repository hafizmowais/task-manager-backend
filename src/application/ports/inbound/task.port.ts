import { Task } from '../../../domain/entities/task.entity';

/**
 * Inbound port for listing tasks
 */
export interface ListTasksPort {
  execute(): Promise<Task[]>;
}

export const LIST_TASKS_PORT = Symbol('LIST_TASKS_PORT');

/**
 * Inbound port for creating a task
 */
export interface CreateTaskPort {
  execute(
    title: string,
    description: string,
    dueDate?: Date | null,
  ): Promise<Task>;
}

export const CREATE_TASK_PORT = Symbol('CREATE_TASK_PORT');

/**
 * Inbound port for editing a task
 */
export interface EditTaskPort {
  execute(
    id: string,
    title?: string,
    description?: string,
    dueDate?: Date | null,
  ): Promise<Task>;
}

export const EDIT_TASK_PORT = Symbol('EDIT_TASK_PORT');

/**
 * Inbound port for deleting a task
 */
export interface DeleteTaskPort {
  execute(id: string): Promise<void>;
}

export const DELETE_TASK_PORT = Symbol('DELETE_TASK_PORT');

/**
 * Inbound port for assigning a task to a user
 */
export interface AssignTaskPort {
  execute(taskId: string, userId: string): Promise<Task>;
}

export const ASSIGN_TASK_PORT = Symbol('ASSIGN_TASK_PORT');

/**
 * Inbound port for getting a task by ID
 */
export interface GetTaskByIdPort {
  execute(id: string): Promise<Task>;
}

export const GET_TASK_BY_ID_PORT = Symbol('GET_TASK_BY_ID_PORT');

/**
 * Inbound port for updating task status
 */
export interface UpdateTaskStatusPort {
  execute(id: string, status: string): Promise<Task>;
}

export const UPDATE_TASK_STATUS_PORT = Symbol('UPDATE_TASK_STATUS_PORT');

