import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/adapters/http/filters/http-exception.filter';

describe('Task Manager API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    
    app.useGlobalFilters(new HttpExceptionFilter());
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Users API', () => {
    let userId: string;

    it('/users (POST) - should create a new user', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Test User',
          email: 'test@example.com',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.name).toBe('Test User');
          expect(response.body.email).toBe('test@example.com');
          userId = response.body.id;
        });
    });

    it('/users (GET) - should list all users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);
        });
    });

    it('/users/:id (GET) - should get user by id', () => {
      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(userId);
          expect(response.body.name).toBe('Test User');
        });
    });

    it('/users (POST) - should fail with invalid email', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Invalid User',
          email: 'invalid-email',
        })
        .expect(400);
    });
  });

  describe('Tasks API', () => {
    let taskId: string;
    let userId: string;

    beforeAll(async () => {
      // Create a user first
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Task Test User',
          email: 'tasktest@example.com',
        });
      userId = response.body.id;
    });

    it('/tasks (POST) - should create a new task', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description',
          dueDate: '2025-12-31T23:59:59Z',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.title).toBe('Test Task');
          expect(response.body.description).toBe('Test Description');
          expect(response.body.status).toBe('TODO');
          taskId = response.body.id;
        });
    });

    it('/tasks (GET) - should list all tasks', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);
        });
    });

    it('/tasks/:id (GET) - should get task by id', () => {
      return request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(taskId);
          expect(response.body.title).toBe('Test Task');
        });
    });

    it('/tasks/:id (PUT) - should update task', () => {
      return request(app.getHttpServer())
        .put(`/tasks/${taskId}`)
        .send({
          title: 'Updated Task',
          description: 'Updated Description',
        })
        .expect(200)
        .then((response) => {
          expect(response.body.title).toBe('Updated Task');
          expect(response.body.description).toBe('Updated Description');
        });
    });

    it('/tasks/:id/assign (POST) - should assign task to user', () => {
      return request(app.getHttpServer())
        .post(`/tasks/${taskId}/assign`)
        .send({
          userId: userId,
        })
        .expect(200)
        .then((response) => {
          expect(response.body.assignedTo).toBe(userId);
        });
    });

    it('/tasks/:id/status (PUT) - should update task status', () => {
      return request(app.getHttpServer())
        .put(`/tasks/${taskId}/status`)
        .send({
          status: 'IN_PROGRESS',
        })
        .expect(200)
        .then((response) => {
          expect(response.body.status).toBe('IN_PROGRESS');
        });
    });

    it('/tasks/:id (DELETE) - should delete task', () => {
      return request(app.getHttpServer())
        .delete(`/tasks/${taskId}`)
        .expect(204);
    });

    it('/tasks/:id (GET) - should return 404 for deleted task', () => {
      return request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .expect(404);
    });

    it('/tasks (POST) - should fail with empty title', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: '',
          description: 'Test Description',
        })
        .expect(400);
    });
  });
});

