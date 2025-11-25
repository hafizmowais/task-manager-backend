import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateUserDto, UserResponseDto } from '../dto/user.dto';
import {
  ListUsersPort,
  LIST_USERS_PORT,
  CreateUserPort,
  CREATE_USER_PORT,
  GetUserByIdPort,
  GET_USER_BY_ID_PORT,
} from '../../../application/ports/inbound/user.port';
import { User } from '../../../domain/entities/user.entity';

/**
 * REST API controller for user operations
 */
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    @Inject(LIST_USERS_PORT)
    private readonly listUsersPort: ListUsersPort,
    @Inject(CREATE_USER_PORT)
    private readonly createUserPort: CreateUserPort,
    @Inject(GET_USER_BY_ID_PORT)
    private readonly getUserByIdPort: GetUserByIdPort,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully', type: [UserResponseDto] })
  async listUsers(): Promise<UserResponseDto[]> {
    const users = await this.listUsersPort.execute();
    return users.map((user) => this.toResponseDto(user));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.getUserByIdPort.execute(id);
    return this.toResponseDto(user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createUser(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.createUserPort.execute(dto.name, dto.email);
    return this.toResponseDto(user);
  }

  private toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

