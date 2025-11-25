import { CreateTaskUseCase } from './create-task.use-case';
import { TaskRepositoryPort } from '../../ports/outbound/task-repository.port';
import { Task, TaskStatus } from '../../../domain/entities/task.entity';
import { ValidationException } from '../../../domain/exceptions/domain.exception';

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let mockRepository: jest.Mocked<TaskRepositoryPort>;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findByAssignedTo: jest.fn(),
    };

    useCase = new CreateTaskUseCase(mockRepository);
  });

  it('should create a new task successfully', async () => {
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

    mockRepository.save.mockResolvedValue(mockTask);

    const result = await useCase.execute('Test Task', 'Test Description');

    expect(result.title).toBe('Test Task');
    expect(result.description).toBe('Test Description');
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('should throw ValidationException if title is empty', async () => {
    await expect(useCase.execute('', 'Description')).rejects.toThrow(
      ValidationException,
    );
  });

  it('should throw ValidationException if description is empty', async () => {
    await expect(useCase.execute('Title', '')).rejects.toThrow(
      ValidationException,
    );
  });
});

