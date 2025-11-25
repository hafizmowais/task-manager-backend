# Getting Started Guide

## 🚀 Quick Start (5 minutes)

### Option 1: Docker (Recommended)

**Prerequisites**: Docker and Docker Compose installed

1. **Clone/navigate to the project:**
```bash
cd task-manager-backend
```

2. **Start everything:**
```bash
docker-compose up
```

3. **Access the application:**
- API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api

That's it! The database and application are running.

### Option 2: Local Development

**Prerequisites**: Node.js 18+, PostgreSQL

1. **Start PostgreSQL with Docker:**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=taskmanager
DATABASE_PASSWORD=taskmanager
DATABASE_NAME=taskmanager_db
PORT=3000
NODE_ENV=development
```

4. **Start the application:**
```bash
npm run start:dev
```

5. **Access the application:**
- API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api

## 📝 First API Calls

### 1. Create a User

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2025-11-24T10:00:00.000Z",
  "updatedAt": "2025-11-24T10:00:00.000Z"
}
```

### 2. Create a Task

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete documentation",
    "description": "Write API documentation and examples",
    "dueDate": "2025-12-31T23:59:59Z"
  }'
```

Response:
```json
{
  "id": "987e6543-e21b-45d3-a654-426614174001",
  "title": "Complete documentation",
  "description": "Write API documentation and examples",
  "status": "TODO",
  "dueDate": "2025-12-31T23:59:59.000Z",
  "assignedTo": null,
  "createdAt": "2025-11-24T10:00:00.000Z",
  "updatedAt": "2025-11-24T10:00:00.000Z"
}
```

### 3. List All Tasks

```bash
curl http://localhost:3000/tasks
```

### 4. Assign Task to User

```bash
curl -X POST http://localhost:3000/tasks/{taskId}/assign \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "{userId}"
  }'
```

### 5. Update Task Status

```bash
curl -X PUT http://localhost:3000/tasks/{taskId}/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS"
  }'
```

## 🧪 Running Tests

### Run all tests:
```bash
npm test
```

### Run tests in watch mode:
```bash
npm run test:watch
```

### Run E2E tests:
```bash
npm run test:e2e
```

### Generate coverage report:
```bash
npm run test:cov
```

Coverage report will be in `coverage/` directory.

## 🔍 Exploring the API

### Swagger UI
Open http://localhost:3000/api in your browser to:
- View all endpoints
- See request/response schemas
- Try API calls directly from the browser
- Download OpenAPI specification

### Available Status Values
Tasks can have these statuses:
- `TODO` - Task is not started
- `IN_PROGRESS` - Task is being worked on
- `DONE` - Task is completed

## 🛠️ Development Commands

```bash
# Start development server with hot reload
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Generate test coverage
npm run test:cov
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up --build

# Remove volumes (clean database)
docker-compose down -v
```

## 📊 Project Structure Overview

```
task-manager-backend/
├── src/
│   ├── domain/              # Business entities and logic
│   ├── application/         # Use cases and ports
│   ├── infrastructure/      # Database, config
│   ├── adapters/           # HTTP controllers, DTOs
│   ├── app.module.ts       # Root module
│   └── main.ts             # Application entry point
├── test/                    # E2E tests
├── docs/                    # Documentation files
├── docker/                  # Docker configuration
│   └── Dockerfile          # Container definition
├── docker-compose.yml      # Multi-container setup (production)
├── docker-compose.dev.yml  # Development database only
└── README.md               # Main documentation
```

## 🎯 What to Try Next

1. **Explore Swagger**: http://localhost:3000/api
2. **Create multiple tasks and users**
3. **Assign tasks to different users**
4. **Update task statuses**
5. **Check the database**: 
   ```bash
   docker exec -it taskmanager-postgres psql -U taskmanager -d taskmanager_db
   ```
6. **Run the tests** to see comprehensive examples
7. **Read [ARCHITECTURE.md](ARCHITECTURE.md)** to understand the design
8. **Modify and extend** the code

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 or 5432 is already in use:
```bash
# Change ports in docker-compose.yml
ports:
  - "3001:3000"  # Change 3000 to 3001
```

### Database Connection Error
Make sure PostgreSQL is running:
```bash
docker-compose -f docker-compose.dev.yml ps
```

### Cannot Connect to Database
Wait a few seconds after starting PostgreSQL for it to be ready.

### Clean Start
Remove all containers and volumes:
```bash
docker-compose down -v
docker-compose up --build
```

## 📚 Next Steps

- Read [README.md](../README.md) for complete documentation
- Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand the design
- Explore the test files to see usage examples
- Try adding new features following the hexagonal architecture

## 💡 Tips

1. **Use Swagger UI** for quick API exploration
2. **Check test files** for usage examples
3. **Database persists** in Docker volume - use `docker-compose down -v` to reset
4. **Hot reload works** in development mode
5. **Strict TypeScript** helps catch errors early

## 🎓 Learning Resources

Inside the project:
- `docs/ARCHITECTURE.md` - Architecture deep dive
- `README.md` - Complete documentation
- Test files - See how to use the API
- Source code - Well-commented and structured

## ✅ Checklist

- [ ] Start the application with Docker
- [ ] Access Swagger UI
- [ ] Create a user via API
- [ ] Create a task via API
- [ ] Assign task to user
- [ ] Update task status
- [ ] Run the tests
- [ ] Read the architecture documentation
- [ ] Explore the code structure

Happy coding! 🚀

