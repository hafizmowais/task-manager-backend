import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from './test-setup';

describe('Users API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('User Management', () => {
    let userId: string;
    const uniqueEmail = `test-${Date.now()}@example.com`;

    it('/users (POST) - should create a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Test User',
          email: uniqueEmail,
        });
      
      if (response.status !== 201) {
        console.error('User creation failed:', response.status, response.body);
      }
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test User');
      expect(response.body.email).toBe(uniqueEmail);
      userId = response.body.id;
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

    it('/users/:id (GET) - should get user by id', async () => {
      if (!userId) {
        throw new Error('userId is not set. Previous test may have failed.');
      }
      
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`);
      
      if (response.status !== 200) {
        console.error('Get user failed:', response.status, response.body);
      }
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(userId);
      expect(response.body.name).toBe('Test User');
      expect(response.body.email).toBe(uniqueEmail);
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
});

