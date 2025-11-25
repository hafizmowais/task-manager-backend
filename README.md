# Task Manager Backend

A production-ready task management backend service built with **Hexagonal Architecture** (Ports & Adapters), **NestJS**, **PostgreSQL**, and **Docker**.

## 📚 Documentation

This project includes comprehensive documentation to help you understand, set up, and work with the codebase. All documentation files are listed below:

| Document | Description | When to Read |
|----------|-------------|--------------|
| **[docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)** | Quick setup guide with Docker and local development instructions | Start here if you're new to the project |
| **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** | Deep dive into the hexagonal architecture, design principles, and layer responsibilities | Read when you want to understand the design decisions |
| **[docs/ARCHITECTURE_DIAGRAMS.md](docs/ARCHITECTURE_DIAGRAMS.md)** | Visual diagrams showing system architecture, data flow, and component interactions | Use for visual learners or when presenting the architecture |
| **[docs/PROJECT_SUMMARY.md](docs/PROJECT_SUMMARY.md)** | Executive summary with key features, architecture highlights, and project statistics | Read for a high-level overview or project summary |
| **[docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md)** | Comprehensive guide on production readiness improvements and best practices | Read when preparing for production deployment |
| **[docs/INDEX.md](docs/INDEX.md)** | Comprehensive documentation index with reading paths by role and detailed file descriptions | Use as a detailed guide to navigate all documentation |

### Quick Navigation

- **New to the project?** → Start with [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)
- **Want to understand the architecture?** → Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/ARCHITECTURE_DIAGRAMS.md](docs/ARCHITECTURE_DIAGRAMS.md)
- **Need a quick overview?** → Check [docs/PROJECT_SUMMARY.md](docs/PROJECT_SUMMARY.md)
- **Looking for specific information?** → Browse [docs/INDEX.md](docs/INDEX.md)

## 🏗️ Architecture

This project follows **Hexagonal Architecture** principles, ensuring clean separation of concerns and high testability:

```
src/
├── domain/              # Pure business logic (entities, value objects)
├── application/         # Use cases and port interfaces
│   ├── ports/
│   │   ├── inbound/    # Interfaces for use cases
│   │   └── outbound/   # Interfaces for repositories
│   └── use-cases/      # Business logic implementations
├── infrastructure/      # External concerns (database, config)
│   ├── persistence/
│   │   ├── entities/   # TypeORM entities
│   │   ├── mappers/    # Domain ↔ Persistence mappers
│   │   └── repositories/ # Repository implementations
│   └── config/         # Configuration files
├── adapters/           # Adapters for external interfaces
│   └── http/          # REST API controllers, DTOs
└── main.ts            # Application bootstrap
```

### Key Design Principles

- **SOLID Principles**: Every class has a single responsibility and dependencies are inverted
- **Dependency Injection**: NestJS DI container manages all dependencies
- **Port/Adapter Pattern**: Domain is isolated from infrastructure concerns
- **Strict TypeScript**: Full type safety with strict mode enabled
- **Domain-Driven Design**: Rich domain entities with business logic

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)

### Running with Docker (Recommended)

Start the entire application with a single command:

```bash
docker-compose up
```

This will:
- Start PostgreSQL database
- Build and start the NestJS application
- Automatically run database migrations
- Expose the API at http://localhost:3000
- Expose Swagger docs at http://localhost:3000/api

### Local Development

1. **Start PostgreSQL only:**
```bash
docker-compose -f docker-compose.dev.yml up
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set environment variables:**
Create a `.env` file:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=taskmanager
DATABASE_PASSWORD=taskmanager
DATABASE_NAME=taskmanager_db
PORT=3000
```

4. **Run the application:**
```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## 📚 API Documentation

Interactive API documentation is available via Swagger at: **http://localhost:3000/api**

### Main Endpoints

#### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List all tasks |
| GET | `/tasks/:id` | Get task by ID |
| POST | `/tasks` | Create new task |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
| POST | `/tasks/:id/assign` | Assign task to user |
| PUT | `/tasks/:id/status` | Update task status |

#### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List all users |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create new user |

### Example Requests

**Create a Task:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive README and API docs",
    "dueDate": "2025-12-31T23:59:59Z"
  }'
```

**Create a User:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com"
  }'
```

**Assign Task to User:**
```bash
curl -X POST http://localhost:3000/tasks/{taskId}/assign \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "{userId}"
  }'
```

**Update Task Status:**
```bash
curl -X PUT http://localhost:3000/tasks/{taskId}/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS"
  }'
```

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Unit Tests
```bash
npm run test
```

### Run E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

### Test Structure

- **Unit Tests**: Test domain entities and use cases in isolation
  - `src/domain/entities/*.spec.ts`
  - `src/application/use-cases/**/*.spec.ts`
  
- **Integration Tests**: Test API endpoints end-to-end
  - `test/app.e2e-spec.ts`

## 🔧 Technology Stack

- **Framework**: NestJS 10
- **Language**: TypeScript 5 (strict mode)
- **Database**: PostgreSQL 15
- **ORM**: TypeORM 0.3
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest, Supertest
- **Containerization**: Docker, Docker Compose

## 📁 Project Structure

### Domain Layer
Pure business logic with no external dependencies:
- **Entities**: `Task`, `User`
- **Value Objects**: `TaskStatus` enum
- **Exceptions**: Domain-specific exceptions

### Application Layer
Contains use cases and defines ports (interfaces):
- **Inbound Ports**: Interfaces for use cases (what the application can do)
- **Outbound Ports**: Interfaces for repositories (what the application needs)
- **Use Cases**: Implementation of business operations

### Infrastructure Layer
Concrete implementations of outbound ports:
- **TypeORM Entities**: Database schema definitions
- **Repositories**: Data persistence implementations
- **Mappers**: Convert between domain and persistence models

### Adapters Layer
Implementations of inbound ports:
- **HTTP Controllers**: REST API endpoints
- **DTOs**: Request/response data transfer objects
- **Exception Filters**: Error handling

## 🎯 Design Decisions

### Why Hexagonal Architecture?

1. **Testability**: Domain logic can be tested without infrastructure
2. **Flexibility**: Easy to swap databases, add GraphQL, CLI, etc.
3. **Maintainability**: Clear boundaries between layers
4. **Scalability**: Independent evolution of business logic and infrastructure

### Why TypeORM?

- Mature and well-maintained ORM
- Excellent TypeScript support
- Migration support
- Works well with NestJS ecosystem

### Why Strict TypeScript?

- Catches errors at compile time
- Better IDE support and autocomplete
- Self-documenting code through types
- Reduces runtime errors

## 🔄 Database Migrations

TypeORM handles schema synchronization automatically in development mode. For production:

```bash
# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## 🌟 Features

- ✅ CRUD operations for tasks and users
- ✅ Task assignment to users
- ✅ Task status management (TODO, IN_PROGRESS, DONE)
- ✅ Due date tracking
- ✅ Input validation
- ✅ Comprehensive error handling
- ✅ API documentation with Swagger
- ✅ Unit and integration tests
- ✅ Docker support for easy deployment
- ✅ Production-ready configuration

## 🚀 Next Steps for Production Readiness

For a comprehensive guide on production readiness improvements, see **[docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md)**.

This document covers high and medium priority enhancements including:
- Logging infrastructure
- Health check endpoints
- Pagination
- Rate limiting
- Security headers
- Input sanitization
- Transaction management
- And more...

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_HOST` | PostgreSQL host | localhost |
| `DATABASE_PORT` | PostgreSQL port | 5432 |
| `DATABASE_USER` | Database username | taskmanager |
| `DATABASE_PASSWORD` | Database password | taskmanager |
| `DATABASE_NAME` | Database name | taskmanager_db |
| `PORT` | Application port | 3000 |
| `NODE_ENV` | Environment | development |

## 🤝 Contributing

This is a technical interview project. The architecture demonstrates best practices for building scalable, maintainable backend services.

## 👤 Author

**Hafiz Muhammad Owais**  
Technical Interview Project for Ayunis  
November 2025

## 📄 License

MIT

---

## 🎓 Learning Resources

This project demonstrates:
- Hexagonal Architecture / Clean Architecture
- SOLID Principles
- Domain-Driven Design (DDD)
- Dependency Injection
- Test-Driven Development (TDD)
- REST API Design
- Docker Containerization
- TypeScript Best Practices

