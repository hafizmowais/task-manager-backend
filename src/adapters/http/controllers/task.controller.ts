import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Inject,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  CreateTaskDto,
  UpdateTaskDto,
  AssignTaskDto,
  UpdateTaskStatusDto,
  TaskResponseDto,
} from '../dto/task.dto';
import {
  ListTasksPort,
  LIST_TASKS_PORT,
  CreateTaskPort,
  CREATE_TASK_PORT,
  EditTaskPort,
  EDIT_TASK_PORT,
  DeleteTaskPort,
  DELETE_TASK_PORT,
  AssignTaskPort,
  ASSIGN_TASK_PORT,
  GetTaskByIdPort,
  GET_TASK_BY_ID_PORT,
  UpdateTaskStatusPort,
  UPDATE_TASK_STATUS_PORT,
} from '../../../application/ports/inbound/task.port';
import { Task } from '../../../domain/entities/task.entity';

/**
 * REST API controller for task operations
 */
@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(
    @Inject(LIST_TASKS_PORT)
    private readonly listTasksPort: ListTasksPort,
    @Inject(CREATE_TASK_PORT)
    private readonly createTaskPort: CreateTaskPort,
    @Inject(EDIT_TASK_PORT)
    private readonly editTaskPort: EditTaskPort,
    @Inject(DELETE_TASK_PORT)
    private readonly deleteTaskPort: DeleteTaskPort,
    @Inject(ASSIGN_TASK_PORT)
    private readonly assignTaskPort: AssignTaskPort,
    @Inject(GET_TASK_BY_ID_PORT)
    private readonly getTaskByIdPort: GetTaskByIdPort,
    @Inject(UPDATE_TASK_STATUS_PORT)
    private readonly updateTaskStatusPort: UpdateTaskStatusPort,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all tasks' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully', type: [TaskResponseDto] })
  async listTasks(): Promise<TaskResponseDto[]> {
    const tasks = await this.listTasksPort.execute();
    return tasks.map((task) => this.toResponseDto(task));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully', type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async getTaskById(@Param('id') id: string): Promise<TaskResponseDto> {
    const task = await this.getTaskByIdPort.execute(id);
    return this.toResponseDto(task);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully', type: TaskResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createTask(@Body() dto: CreateTaskDto): Promise<TaskResponseDto> {
    const dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    const task = await this.createTaskPort.execute(
      dto.title,
      dto.description,
      dueDate,
    );
    return this.toResponseDto(task);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task updated successfully', type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async updateTask(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    const dueDate = dto.dueDate ? new Date(dto.dueDate) : undefined;
    const task = await this.editTaskPort.execute(
      id,
      dto.title,
      dto.description,
      dueDate,
    );
    return this.toResponseDto(task);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 204, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async deleteTask(@Param('id') id: string): Promise<void> {
    await this.deleteTaskPort.execute(id);
  }

  @Post(':id/assign')
  @ApiOperation({ summary: 'Assign a task to a user' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task assigned successfully', type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task or user not found' })
  async assignTask(
    @Param('id') id: string,
    @Body() dto: AssignTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.assignTaskPort.execute(id, dto.userId);
    return this.toResponseDto(task);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update task status' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task status updated successfully', type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto,
  ): Promise<TaskResponseDto> {
    const task = await this.updateTaskStatusPort.execute(id, dto.status);
    return this.toResponseDto(task);
  }

  private toResponseDto(task: Task): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,
      assignedTo: task.assignedTo,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}

