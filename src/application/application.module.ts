import { Module } from '@nestjs/common';
import { PersistenceModule } from '../infrastructure/persistence/persistence.module';

// Task use cases
import { ListTasksUseCase } from './use-cases/task/list-tasks.use-case';
import { CreateTaskUseCase } from './use-cases/task/create-task.use-case';
import { EditTaskUseCase } from './use-cases/task/edit-task.use-case';
import { DeleteTaskUseCase } from './use-cases/task/delete-task.use-case';
import { AssignTaskUseCase } from './use-cases/task/assign-task.use-case';
import { GetTaskByIdUseCase } from './use-cases/task/get-task-by-id.use-case';
import { UpdateTaskStatusUseCase } from './use-cases/task/update-task-status.use-case';

// User use cases
import { ListUsersUseCase } from './use-cases/user/list-users.use-case';
import { CreateUserUseCase } from './use-cases/user/create-user.use-case';
import { GetUserByIdUseCase } from './use-cases/user/get-user-by-id.use-case';

// Port symbols
import {
  LIST_TASKS_PORT,
  CREATE_TASK_PORT,
  EDIT_TASK_PORT,
  DELETE_TASK_PORT,
  ASSIGN_TASK_PORT,
  GET_TASK_BY_ID_PORT,
  UPDATE_TASK_STATUS_PORT,
} from './ports/inbound/task.port';
import {
  LIST_USERS_PORT,
  CREATE_USER_PORT,
  GET_USER_BY_ID_PORT,
} from './ports/inbound/user.port';

/**
 * Application module - provides use case implementations
 */
@Module({
  imports: [PersistenceModule],
  providers: [
    // Task use cases
    {
      provide: LIST_TASKS_PORT,
      useClass: ListTasksUseCase,
    },
    {
      provide: CREATE_TASK_PORT,
      useClass: CreateTaskUseCase,
    },
    {
      provide: EDIT_TASK_PORT,
      useClass: EditTaskUseCase,
    },
    {
      provide: DELETE_TASK_PORT,
      useClass: DeleteTaskUseCase,
    },
    {
      provide: ASSIGN_TASK_PORT,
      useClass: AssignTaskUseCase,
    },
    {
      provide: GET_TASK_BY_ID_PORT,
      useClass: GetTaskByIdUseCase,
    },
    {
      provide: UPDATE_TASK_STATUS_PORT,
      useClass: UpdateTaskStatusUseCase,
    },
    // User use cases
    {
      provide: LIST_USERS_PORT,
      useClass: ListUsersUseCase,
    },
    {
      provide: CREATE_USER_PORT,
      useClass: CreateUserUseCase,
    },
    {
      provide: GET_USER_BY_ID_PORT,
      useClass: GetUserByIdUseCase,
    },
  ],
  exports: [
    LIST_TASKS_PORT,
    CREATE_TASK_PORT,
    EDIT_TASK_PORT,
    DELETE_TASK_PORT,
    ASSIGN_TASK_PORT,
    GET_TASK_BY_ID_PORT,
    UPDATE_TASK_STATUS_PORT,
    LIST_USERS_PORT,
    CREATE_USER_PORT,
    GET_USER_BY_ID_PORT,
  ],
})
export class ApplicationModule {}

