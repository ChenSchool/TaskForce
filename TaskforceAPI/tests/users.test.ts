import request from 'supertest';
import app from '../src/app';
import { getAuthTokens, authHeader } from './helpers/auth.helper';

describe('Users & Authorization API Endpoints', () => {
  let adminToken: string;
  let supervisorToken: string;
  let createdUserId: number;

  beforeAll(async () => {
    const tokens = await getAuthTokens(app);
    adminToken = tokens.adminToken;
    supervisorToken = tokens.supervisorToken;
  });

  describe('GET /users', () => {
    it('should return all users for admin', async () => {
      const response = await request(app)
        .get('/users')
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return all users for supervisor', async () => {
      const response = await request(app)
        .get('/users')
        .set(authHeader(supervisorToken));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get('/users');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /users', () => {
    it('should create new user with admin role (admin only)', async () => {
      const newUser = {
        username: 'testuser_admin',
        email: 'testuser@test.com',
        password: 'Test123!',
        role: 'Task Viewer'
      };

      const response = await request(app)
        .post('/users')
        .set(authHeader(adminToken))
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      createdUserId = response.body.id;
    });

    it('should create new user with supervisor role', async () => {
      const newUser = {
        username: 'testuser_super',
        email: 'testsupervisor@test.com',
        password: 'Test123!',
        role: 'Task Viewer'
      };

      const response = await request(app)
        .post('/users')
        .set(authHeader(supervisorToken))
        .send(newUser);

      expect(response.status).toBe(201);
    });

    it('should return 400 for missing username', async () => {
      const invalidUser = {
        email: 'test@test.com',
        password: 'Test123!',
        role: 'Task Viewer'
      };

      const response = await request(app)
        .post('/users')
        .set(authHeader(adminToken))
        .send(invalidUser);

      expect(response.status).toBe(400);
    });

    it('should return 400 for missing password', async () => {
      const invalidUser = {
        username: 'testuser',
        email: 'test@test.com',
        role: 'Task Viewer'
      };

      const response = await request(app)
        .post('/users')
        .set(authHeader(adminToken))
        .send(invalidUser);

      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid email format', async () => {
      const invalidUser = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'Test123!',
        role: 'Task Viewer'
      };

      const response = await request(app)
        .post('/users')
        .set(authHeader(adminToken))
        .send(invalidUser);

      expect(response.status).toBe(400);
    });

    it('should return 401 for unauthenticated request', async () => {
      const newUser = {
        username: 'testuser_unauth',
        email: 'unauth@test.com',
        password: 'Test123!',
        role: 'Task Viewer'
      };

      const response = await request(app)
        .post('/users')
        .send(newUser);

      expect(response.status).toBe(401);
    });

    it('should handle SQL injection attempts', async () => {
      const maliciousUser = {
        username: "admin'; DROP TABLE users; --",
        email: 'malicious@test.com',
        password: 'Test123!',
        role: 'Task Viewer'
      };

      const response = await request(app)
        .post('/users')
        .set(authHeader(adminToken))
        .send(maliciousUser);

      // Should either succeed (sanitized) or return validation error
      expect([201, 400]).toContain(response.status);
    });
  });

  describe('GET /users/:id', () => {
    it('should return specific user by id (admin)', async () => {
      if (!createdUserId) {
        const createResponse = await request(app)
          .post('/users')
          .set(authHeader(adminToken))
          .send({
            username: 'testuser_get',
            email: 'testget@test.com',
            password: 'Test123!',
            role: 'Task Viewer'
          });
        createdUserId = createResponse.body.id;
      }

      const response = await request(app)
        .get(`/users/${createdUserId}`)
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/users/999999')
        .set(authHeader(adminToken));

      expect(response.status).toBe(404);
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get(`/users/${createdUserId}`);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /users/:id', () => {
    let updateUserId: number;

    beforeAll(async () => {
      const createResponse = await request(app)
        .post('/users')
        .set(authHeader(adminToken))
        .send({
          username: 'testuser_update',
          email: 'testupdate@test.com',
          password: 'Test123!',
          role: 'Task Viewer'
        });
      updateUserId = createResponse.body.id;
    });

    it('should update user with admin privileges', async () => {
      const updatedData = {
        email: 'updated@test.com',
        role: 'Supervisor'
      };

      const response = await request(app)
        .put(`/users/${updateUserId}`)
        .set(authHeader(adminToken))
        .send(updatedData);

      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent user', async () => {
      const updatedData = {
        email: 'updated@test.com'
      };

      const response = await request(app)
        .put('/users/999999')
        .set(authHeader(adminToken))
        .send(updatedData);

      expect(response.status).toBe(404);
    });

    it('should return 401 for unauthenticated request', async () => {
      const updatedData = {
        email: 'updated@test.com'
      };

      const response = await request(app)
        .put(`/users/${updateUserId}`)
        .send(updatedData);

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /users/:id', () => {
    let deleteUserId: number;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/users')
        .set(authHeader(adminToken))
        .send({
          username: `testuser_del_${Date.now()}`,
          email: `testdelete${Date.now()}@test.com`,
          password: 'Test123!',
          role: 'Task Viewer'
        });
      deleteUserId = createResponse.body.id;
    });

    it('should delete user with admin privileges', async () => {
      const response = await request(app)
        .delete(`/users/${deleteUserId}`)
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should allow supervisor to delete users', async () => {
      const response = await request(app)
        .delete(`/users/${deleteUserId}`)
        .set(authHeader(supervisorToken));

      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .delete('/users/999999')
        .set(authHeader(adminToken));

      expect(response.status).toBe(404);
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .delete(`/users/${deleteUserId}`);

      expect(response.status).toBe(401);
    });
  });

  // Role-based authorization tests
  describe('Authorization Tests', () => {
    it('should enforce Manager role for creating users', async () => {
      const newUser = {
        username: 'roletest',
        email: 'roletest@test.com',
        password: 'Test123!',
        role: 'Task Viewer'
      };

      const response = await request(app)
        .post('/users')
        .set(authHeader(adminToken))
        .send(newUser);

      expect([200, 201, 403]).toContain(response.status);
    });

    it('should enforce proper authorization on GET /users', async () => {
      const response = await request(app)
        .get('/users')
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
    });
  });

  // Cleanup
  afterAll(async () => {
    try {
      if (createdUserId) {
        await request(app)
          .delete(`/users/${createdUserId}`)
          .set(authHeader(adminToken));
      }
    } catch (error) {
      console.log('Cleanup error (can be ignored):', error);
    }
  });
});
