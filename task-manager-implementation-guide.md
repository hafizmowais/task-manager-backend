# Task Manager Backend – Hexagonal Architecture (NestJS + PostgreSQL + Docker) (This file should be deleted after development is done but i keep it to show how the app is beign developed)

## 🟢 Overview

A backend service for a task management application, built with hexagonal architecture (ports & adapters), TypeScript strict typing, SOLID principles, and full Docker support for single-command startup. Designed for production readiness and maintainability.

---

## 📦 Project Structure

```
/task-manager-backend
├── src/
│   ├── domain/           # Entities, aggregates, domain services (pure TypeScript)
│   ├── application/      # Use cases (ports: inbound/outbound interfaces)
│   ├── infrastructure/   # Adapters: persistence, web API, external services
│   ├── adapters/         # Maps domain/ports to infra & vice versa
│   └── main.ts           # NestJS bootstrap
├── test/                 # Unit/integration tests
├── Dockerfile            # App container instructions
├── docker-compose.yml    # Compose file to run app + PostgreSQL
├── .dockerignore
├── README.md
├── package.json
├── tsconfig.json
```

---

## 🗂️ Action Items

- [ ] **Set Up Project**
  - Run: `nest new task-manager-backend`
  - Enable strict typing in `tsconfig.json`
  - Install PostgreSQL adapter (`@nestjs/typeorm` or Prisma)

- [ ] **Domain Layer**
  - Implement `Task` entity (id, title, description, status, dueDate, assignedTo)
  - Implement `User` entity (id, name, email)
  - Implement value objects as needed (e.g., TaskStatus)
  - Adhere to single responsibility; keep domain pure

- [ ] **Application Layer (Ports)**
  - Define inbound ports (interfaces) for:
    - ListTasksPort
    - CreateTaskPort
    - EditTaskPort
    - DeleteTaskPort
    - AssignTaskPort
  - Define outbound ports (e.g., TaskRepositoryPort)

- [ ] **Infrastructure Layer (Adapters)**
  - PostgreSQL adapter using TypeORM/Prisma (implements repository port)
  - REST API controller adapters for HTTP requests
  - Mappers for transforming between persistence+domain models

- [ ] **Application Services (Use Cases)**
  - Implement each use case; inject via NestJS DI
  - Each service must be closed for modification, open for extension

- [ ] **Error Handling & Validation**
  - Use DTOs & NestJS class-validator for inputs
  - Central error handler with custom exceptions

- [ ] **Docker Setup**
  - Write a `Dockerfile` for NestJS app
  - Write a `docker-compose.yml` to run app + PostgreSQL
  - Ensure DB migrations run on container startup
  - Set env variables for DB connection
  - **Single-command launch**: `docker-compose up` brings up database and app

- [ ] **Testing**
  - Unit tests for entities/services (Jest)
  - Integration tests for API using Supertest
  - Use port mocking to test hexagonal separation

- [ ] **Documentation & README**
  - Comment code with JSDoc for clarity
  - Document API endpoints (Swagger/OpenAPI)
  - Document architectural decisions, project setup, testing strategy

---

## 🛠️ Technologies & Tools

- NestJS (TypeScript server framework)
- PostgreSQL (relational database)
- Docker & Docker Compose (containerization)
- Prisma or TypeORM (ORM)
- Jest (unit testing)
- class-validator, class-transformer (for DTO validation)
- Swagger (API docs)

---

## 🚀 Quick Start with Docker

**Prerequisites:**  
- Install Docker & Docker Compose

**Single command to launch everything:**  
```bash
docker-compose up
```
- Starts PostgreSQL container
- Builds/starts NestJS app container
- Runs schema migrations if needed
- Exposes API at `http://localhost:3000`

**Environment Variables:**  
Defaults in `docker-compose.yml`; override with `.env` file:
```
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=taskmanager
DATABASE_PASSWORD=taskmanager
DATABASE_NAME=taskmanager_db
```

---

## API Endpoints (REST)

| Method | Endpoint           | Description                  |
|--------|--------------------|------------------------------|
| GET    | /tasks             | List tasks                   |
| POST   | /tasks             | Create new task              |
| PUT    | /tasks/{id}        | Edit existing task           |
| DELETE | /tasks/{id}        | Delete task                  |
| POST   | /tasks/{id}/assign | Assign user to task          |

Interactive API docs at `http://localhost:3000/api` (Swagger).

---

## Hexagonal Architecture Rationale

- **Testability:** Easily mock adapters in tests
- **Separation of concerns:** Domain logic is agnostic to HTTP, DB, etc.
- **Scalability:** Add new adapters (GraphQL, CLI) without changing domain
- **Maintainability:** Stable domain; infra can evolve independently

## SOLID Principles Applied

- **Single Responsibility:** Each module/class does one thing
- **Open/Closed:** Add features by extension (ports/adapters)
- **Liskov Substitution:** Use strict interfaces, proper typing
- **Interface Segregation:** Ports are fine-grained; avoid fat interfaces
- **Dependency Inversion:** DL depends on abstractions (ports), not concrete adapters

---

## Testing Strategy

- **Unit tests** for domain and use case logic
- **Integration tests** for actual HTTP and DB behavior
- **Coverage** tracking with Jest
- **Port mocking** for isolated use case verification

Run tests:
```bash
npm run test
npm run test:e2e
npm run test:cov
```

---

## Example Docker Setup

**Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: taskmanager
      POSTGRES_PASSWORD: taskmanager
      POSTGRES_DB: taskmanager_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_USER: taskmanager
      DATABASE_PASSWORD: taskmanager
      DATABASE_NAME: taskmanager_db
    depends_on:
      - postgres
    command: sh -c "npm run typeorm migration:run && npm run start:prod"

volumes:
  postgres_data:
```

---

## What Could Be Added with More Time

- Advanced task filtering/pagination
- Domain events for notifications
- Authentication/authorization (JWT)
- GraphQL support
- Logging & metrics
- CI/CD pipeline
- API rate limiting
- Database indexing/performance tuning

---

## Architectural Decision Notes

- Hexagonal architecture ensures stable, testable business logic
- NestJS DI for adapter/service injection
- PostgreSQL and Docker for reliable deployment
- Strict TypeScript for type safety and clean contracts

---

## Contact

Project by Hafiz Muhammad Owais for Ayunis technical interview, 25 November 2025

---

## Implementation Checklist

1. ✅ Scaffold NestJS project
2. ✅ Implement domain entities and value objects with strict typing
3. ✅ Define application layer ports/interfaces
4. ✅ Implement PostgreSQL adapter
5. ✅ Develop REST controller adapters for HTTP requests
6. ✅ Setup Docker/Docker Compose for single command startup
7. ✅ Document layers/architecture & add API docs
8. ✅ Complete unit/integration tests
9. ✅ Prepare repo and test locally with `docker-compose up`