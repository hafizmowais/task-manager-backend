# Architecture Documentation

## 🏗️ Hexagonal Architecture Overview

This project implements **Hexagonal Architecture** (also known as Ports and Adapters), which promotes:

- **Independence from frameworks**: The core business logic doesn't depend on NestJS
- **Independence from UI**: Easy to add GraphQL, gRPC, or CLI without touching business logic
- **Independence from databases**: Can switch from PostgreSQL to MongoDB with minimal changes
- **Testability**: Business logic can be tested without any infrastructure

## 📐 Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     Adapters (Input)                        │
│         HTTP Controllers, GraphQL Resolvers, CLI            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│              Inbound Ports (Use Case Interfaces)            │
│                      Use Cases                              │
│             Outbound Ports (Repository Interfaces)          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Domain Layer                           │
│            Entities, Value Objects, Domain Logic            │
│                  (Pure TypeScript)                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Adapters (Output)                          │
│          Repositories, External APIs, Message Queues        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Infrastructure                            │
│            PostgreSQL, Redis, External Services             │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Layer Responsibilities

### 1. Domain Layer (`src/domain/`)

**Purpose**: Contains pure business logic with zero external dependencies.

**Components**:
- **Entities**: `Task`, `User` - Core business objects with identity
- **Value Objects**: `TaskStatus` - Immutable descriptive objects
- **Domain Exceptions**: Business rule violations

**Rules**:
- ✅ No imports from other layers
- ✅ No framework dependencies
- ✅ Pure TypeScript classes
- ✅ Rich domain models with behavior

**Example**:
```typescript
class Task {
  updateStatus(status: TaskStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }
  
  isOverdue(): boolean {
    return this.dueDate < new Date() && this.status !== TaskStatus.DONE;
  }
}
```

### 2. Application Layer (`src/application/`)

**Purpose**: Orchestrates domain objects to fulfill use cases.

**Components**:
- **Inbound Ports**: Interfaces defining what the application can do
  - `CreateTaskPort`, `ListTasksPort`, etc.
- **Outbound Ports**: Interfaces defining what the application needs
  - `TaskRepositoryPort`, `UserRepositoryPort`
- **Use Cases**: Implementations of business operations

**Rules**:
- ✅ Depends on domain layer
- ✅ Defines interfaces (ports)
- ✅ No framework-specific code
- ✅ No database or HTTP details

**Example**:
```typescript
@Injectable()
class CreateTaskUseCase implements CreateTaskPort {
  constructor(
    @Inject(TASK_REPOSITORY_PORT)
    private repository: TaskRepositoryPort
  ) {}
  
  async execute(title: string, description: string): Promise<Task> {
    const task = Task.create(uuid(), title, description);
    return this.repository.save(task);
  }
}
```

### 3. Infrastructure Layer (`src/infrastructure/`)

**Purpose**: Provides concrete implementations of outbound ports.

**Components**:
- **TypeORM Entities**: Database schema
- **Repositories**: Implement repository ports
- **Mappers**: Convert between domain and persistence models
- **Configuration**: Database, logging, etc.

**Rules**:
- ✅ Implements outbound ports
- ✅ Contains framework-specific code
- ✅ Handles external concerns

**Example**:
```typescript
@Injectable()
class TaskRepository implements TaskRepositoryPort {
  async save(task: Task): Promise<Task> {
    const entity = TaskMapper.toPersistence(task);
    const saved = await this.repository.save(entity);
    return TaskMapper.toDomain(saved);
  }
}
```

### 4. Adapters Layer (`src/adapters/`)

**Purpose**: Adapts external interfaces to application ports.

**Components**:
- **HTTP Controllers**: REST API endpoints
- **DTOs**: Request/response validation
- **Exception Filters**: Error handling

**Rules**:
- ✅ Implements inbound ports
- ✅ Handles HTTP concerns
- ✅ Validates input
- ✅ Maps to domain models

**Example**:
```typescript
@Controller('tasks')
class TaskController {
  constructor(
    @Inject(CREATE_TASK_PORT)
    private createTask: CreateTaskPort
  ) {}
  
  @Post()
  async create(@Body() dto: CreateTaskDto) {
    return this.createTask.execute(dto.title, dto.description);
  }
}
```

## 🔄 Data Flow

### Creating a Task (Example)

1. **HTTP Request** arrives at `TaskController`
2. **Controller** validates input via DTO
3. **Controller** calls `CreateTaskUseCase` through `CreateTaskPort`
4. **Use Case** creates domain `Task` entity
5. **Use Case** calls `TaskRepositoryPort.save()`
6. **Repository** converts domain `Task` to `TaskEntity`
7. **TypeORM** persists to **PostgreSQL**
8. **Repository** converts back to domain `Task`
9. **Use Case** returns `Task` to **Controller**
10. **Controller** maps to response DTO and returns HTTP response

```
HTTP Request
    ↓
TaskController (Adapter)
    ↓
CreateTaskUseCase (Application)
    ↓
Task.create() (Domain)
    ↓
TaskRepository (Infrastructure)
    ↓
PostgreSQL
```

## 🧩 Dependency Inversion

The architecture strictly follows the **Dependency Inversion Principle**:

- **High-level modules** (domain, application) don't depend on low-level modules (infrastructure)
- Both depend on **abstractions** (ports/interfaces)
- **Abstractions** don't depend on details
- **Details** depend on abstractions

```
┌─────────────────┐         ┌──────────────────────┐
│  Use Case       │────────▶│  RepositoryPort      │
│  (Application)  │  uses   │  (Interface)         │
└─────────────────┘         └──────────────────────┘
                                      ▲
                                      │ implements
                            ┌─────────┴──────────┐
                            │   Repository       │
                            │  (Infrastructure)  │
                            └────────────────────┘
```

## 🎭 Ports and Adapters

### Inbound Ports (Driving Side)

Define **what the application can do**:
- `CreateTaskPort`
- `ListTasksPort`
- `AssignTaskPort`

Implemented by **Use Cases** in the application layer.
Called by **Adapters** (HTTP controllers, CLI, GraphQL).

### Outbound Ports (Driven Side)

Define **what the application needs**:
- `TaskRepositoryPort`
- `UserRepositoryPort`

Defined in the **application layer**.
Implemented by **Infrastructure** (repositories, external APIs).

## 🔌 Adding New Adapters

### Example: Adding GraphQL Support

1. Create GraphQL resolver in `src/adapters/graphql/`
2. Inject existing use case ports
3. Map GraphQL input to use case calls
4. Map domain models to GraphQL types

**No changes needed to domain or application layers!**

### Example: Switching Database

1. Create new repository implementation
2. Implement existing `TaskRepositoryPort`
3. Update DI configuration

**No changes needed to domain or application layers!**

## 🧪 Testing Strategy

### Unit Tests (Domain)
Test entities and value objects in isolation:
```typescript
describe('Task', () => {
  it('should create task with TODO status', () => {
    const task = Task.create('1', 'Title', 'Description');
    expect(task.status).toBe(TaskStatus.TODO);
  });
});
```

### Unit Tests (Application)
Test use cases with mocked repositories:
```typescript
describe('CreateTaskUseCase', () => {
  it('should create task', async () => {
    const mockRepo = { save: jest.fn() };
    const useCase = new CreateTaskUseCase(mockRepo);
    await useCase.execute('Title', 'Description');
    expect(mockRepo.save).toHaveBeenCalled();
  });
});
```

### Integration Tests (API)
Test entire stack end-to-end:
```typescript
describe('Tasks API', () => {
  it('POST /tasks should create task', () => {
    return request(app)
      .post('/tasks')
      .send({ title: 'Task', description: 'Desc' })
      .expect(201);
  });
});
```

## 📚 Benefits of This Architecture

### 1. Testability
- Domain logic tested without database
- Use cases tested with mocked repositories
- Easy to write fast, reliable tests

### 2. Flexibility
- Swap PostgreSQL for MongoDB
- Add GraphQL without touching business logic
- Support multiple frontends

### 3. Maintainability
- Clear boundaries between layers
- Business logic isolated and protected
- Easy to understand and modify

### 4. Scalability
- Domain and application layers remain stable
- Infrastructure can evolve independently
- Easy to add new features

### 5. Team Productivity
- Different teams can work on different layers
- Clear interfaces reduce integration issues
- New team members understand structure quickly

## 🎓 Key Takeaways

1. **Domain is king**: Protect business logic from external concerns
2. **Depend on abstractions**: Use interfaces (ports) not concrete implementations
3. **Invert dependencies**: High-level modules should not depend on low-level modules
4. **Separate concerns**: Each layer has a specific responsibility
5. **Test independently**: Each layer can be tested in isolation

## 📖 Further Reading

- [Hexagonal Architecture by Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [DDD, Hexagonal, Onion, Clean, CQRS](https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/)

