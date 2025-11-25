import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../../../domain/entities/task.entity';

/**
 * DTO for creating a task
 */
export class CreateTaskDto {
  @ApiProperty({ description: 'Task title', example: 'Complete project documentation' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: 'Task description', example: 'Write comprehensive docs for the API' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional({ description: 'Due date', example: '2025-12-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

/**
 * DTO for updating a task
 */
export class UpdateTaskDto {
  @ApiPropertyOptional({ description: 'Task title', example: 'Complete project documentation' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({ description: 'Task description', example: 'Write comprehensive docs for the API' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional({ description: 'Due date', example: '2025-12-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

/**
 * DTO for assigning a task
 */
export class AssignTaskDto {
  @ApiProperty({ description: 'User ID to assign task to', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsNotEmpty()
  userId!: string;
}

/**
 * DTO for updating task status
 */
export class UpdateTaskStatusDto {
  @ApiProperty({ 
    description: 'Task status', 
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS 
  })
  @IsEnum(TaskStatus)
  status!: TaskStatus;
}

/**
 * DTO for task response
 */
export class TaskResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ enum: TaskStatus })
  status!: TaskStatus;

  @ApiPropertyOptional()
  dueDate!: Date | null;

  @ApiPropertyOptional()
  assignedTo!: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

