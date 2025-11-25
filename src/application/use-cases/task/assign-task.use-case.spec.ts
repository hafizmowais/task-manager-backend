import { AssignTaskUseCase } from './assign-task.use-case';
import { TaskRepositoryPort } from '../../ports/outbound/task-repository.port';
import { UserRepositoryPort } from '../../ports/outbound/user-repository.port';
import { Task, TaskStatus } from '../../../domain/entities/task.entity';
import { User } from '../../../domain/entities/user.entity';
import { EntityNotFoundException } from '../../../domain/exceptions/domain.exception';

describe('AssignTaskUseCase', () => {
  let useCase: AssignTaskUseCase;
  let mockTaskRepository: jest.Mocked<TaskRepositoryPort>;
  let mockUserRepository: jest.Mocked<UserRepositoryPort>;

  beforeEach(() => {
    mockTaskRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findByAssignedTo: jest.fn(),
    };

    mockUserRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findByEmail: jest.fn(),
    };

    useCase = new AssignTaskUseCase(mockTaskRepository, mockUserRepository);
  });

  it('should assign task to user successfully', async () => {
    const mockTask = new Task(
      '1',
      'Test Task',
      'Test Description',
      TaskStatus.TODO,
      null,
      null,
      new Date(),
      new Date(),
    );

    const mockUser = new User('user-1', 'John Doe', 'john@example.com', new Date(), new Date());

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockTaskRepository.save.mockResolvedValue(mockTask);

    const result = await useCase.execute('1', 'user-1');

    expect(result.assignedTo).toBe('user-1');
    expect(mockTaskRepository.save).toHaveBeenCalled();
  });

  it('should throw EntityNotFoundException if task not found', async () => {
    mockTaskRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('1', 'user-1')).rejects.toThrow(
      EntityNotFoundException,
    );
  });

  it('should throw EntityNotFoundException if user not found', async () => {
    const mockTask = new Task(
      '1',
      'Test Task',
      'Test Description',
      TaskStatus.TODO,
      null,
      null,
      new Date(),
      new Date(),
    );

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('1', 'user-1')).rejects.toThrow(
      EntityNotFoundException,
    );
  });
});

