import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from './test-setup';

describe('Tasks API (e2e)', () => {
  let app: INestApplication;
  let taskId: string;
  let userId: string;

  beforeAll(async () => {
    app = await createTestApp();
    
    // Create a user first for task assignment tests with unique email
    const uniqueEmail = `tasktest-${Date.now()}@example.com`;
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Task Test User',
        email: uniqueEmail,
      });
    
    if (response.status !== 201) {
      console.error('User creation in beforeAll failed:', response.status, response.body);
      throw new Error(`Failed to create test user: ${JSON.stringify(response.body)}`);
    }
    
    userId = response.body.id;
    expect(userId).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Task CRUD Operations', () => {
    it('/tasks (POST) - should create a new task', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description',
          dueDate: '2025-12-31T23:59:59Z',
        });
      
      if (response.status !== 201) {
        console.error('Task creation failed:', response.status, response.body);
      }
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Task');
      expect(response.body.description).toBe('Test Description');
      expect(response.body.status).toBe('TODO');
      taskId = response.body.id;
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

    it('/tasks/:id (GET) - should get task by id', async () => {
      if (!taskId) {
        throw new Error('taskId is not set. Previous test may have failed.');
      }
      
      const response = await request(app.getHttpServer())
        .get(`/tasks/${taskId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(taskId);
      expect(response.body.title).toBe('Test Task');
    });

    it('/tasks/:id (PUT) - should update task', async () => {
      if (!taskId) {
        throw new Error('taskId is not set. Previous test may have failed.');
      }
      
      const response = await request(app.getHttpServer())
        .put(`/tasks/${taskId}`)
        .send({
          title: 'Updated Task',
          description: 'Updated Description',
        });
      
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Task');
      expect(response.body.description).toBe('Updated Description');
    });
  });

  describe('Task Assignment and Status', () => {
    it('/tasks/:id/assign (POST) - should assign task to user', async () => {
      if (!taskId || !userId) {
        throw new Error('taskId or userId is not set. Previous tests may have failed.');
      }
      
      const response = await request(app.getHttpServer())
        .post(`/tasks/${taskId}/assign`)
        .send({
          userId: userId,
        });
      
      if (response.status !== 200) {
        console.error('Task assignment failed:', response.status, response.body);
      }
      
      expect(response.status).toBe(200);
      expect(response.body.assignedTo).toBe(userId);
    });

    it('/tasks/:id/status (PUT) - should update task status', async () => {
      if (!taskId) {
        throw new Error('taskId is not set. Previous test may have failed.');
      }
      
      const response = await request(app.getHttpServer())
        .put(`/tasks/${taskId}/status`)
        .send({
          status: 'IN_PROGRESS',
        });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('IN_PROGRESS');
    });
  });

  describe('Task Deletion', () => {
    it('/tasks/:id (DELETE) - should delete task', async () => {
      if (!taskId) {
        throw new Error('taskId is not set. Previous test may have failed.');
      }
      
      const response = await request(app.getHttpServer())
        .delete(`/tasks/${taskId}`);
      
      expect(response.status).toBe(204);
    });

    it('/tasks/:id (GET) - should return 404 for deleted task', async () => {
      if (!taskId) {
        throw new Error('taskId is not set. Previous test may have failed.');
      }
      
      const response = await request(app.getHttpServer())
        .get(`/tasks/${taskId}`);
      
      expect(response.status).toBe(404);
    });
  });

  describe('Task Validation', () => {
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

