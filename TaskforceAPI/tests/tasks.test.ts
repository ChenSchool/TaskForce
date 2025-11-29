import request from 'supertest';
import app from '../src/app';
import { getAuthTokens, authHeader } from './helpers/auth.helper';

describe('Tasks API Endpoints', () => {
  let adminToken: string;
  let supervisorToken: string;
  let testAircraftId: number;
  let createdTaskId: number;

  beforeAll(async () => {
    const tokens = await getAuthTokens(app);
    adminToken = tokens.adminToken;
    supervisorToken = tokens.supervisorToken;

    // Create a test aircraft for task creation
    const aircraftResponse = await request(app)
      .post('/aircraft')
      .set(authHeader(adminToken))
      .send({ tail_number: 'TEST-TASK-AIRCRAFT' });
    testAircraftId = aircraftResponse.body.insertId;
  });

  describe('GET /tasks', () => {
    it('should return all tasks for authenticated user', async () => {
      const response = await request(app)
        .get('/tasks')
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get('/tasks');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /tasks', () => {
    it('should create new task with valid data (admin)', async () => {
      const newTask = {
        aircraft_id: testAircraftId,
        shift: '1st',
        description: 'Test task creation',
        status: 'In Progress',
        date: '2024-12-01'
      };

      const response = await request(app)
        .post('/tasks')
        .set(authHeader(adminToken))
        .send(newTask);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      createdTaskId = response.body.id;
    });

    it('should create new task with valid data (supervisor)', async () => {
      const newTask = {
        aircraft_id: testAircraftId,
        shift: '2nd',
        description: 'Supervisor task creation',
        status: 'Pending',
        date: '2024-12-02'
      };

      const response = await request(app)
        .post('/tasks')
        .set(authHeader(supervisorToken))
        .send(newTask);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 400 for missing required fields', async () => {
      const invalidTask = {
        shift: '1st'
        // Missing aircraft_id, description, date
      };

      const response = await request(app)
        .post('/tasks')
        .set(authHeader(adminToken))
        .send(invalidTask);

      expect(response.status).toBe(400);
    });

    it('should return 400 for empty description', async () => {
      const invalidTask = {
        aircraft_id: testAircraftId,
        shift: '1st',
        description: '',
        status: 'In Progress',
        date: '2024-12-01'
      };

      const response = await request(app)
        .post('/tasks')
        .set(authHeader(adminToken))
        .send(invalidTask);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Description');
    });

    it('should return 400 for missing date', async () => {
      const invalidTask = {
        aircraft_id: testAircraftId,
        shift: '1st',
        description: 'Task without date',
        status: 'In Progress'
        // Missing date
      };

      const response = await request(app)
        .post('/tasks')
        .set(authHeader(adminToken))
        .send(invalidTask);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Date');
    });

    it('should return 400 for missing aircraft_id', async () => {
      const invalidTask = {
        shift: '1st',
        description: 'Task without aircraft',
        status: 'In Progress',
        date: '2024-12-01'
        // Missing aircraft_id
      };

      const response = await request(app)
        .post('/tasks')
        .set(authHeader(adminToken))
        .send(invalidTask);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Aircraft');
    });

    it('should return 400 for missing shift', async () => {
      const invalidTask = {
        aircraft_id: testAircraftId,
        description: 'Task without shift',
        status: 'In Progress',
        date: '2024-12-01'
        // Missing shift
      };

      const response = await request(app)
        .post('/tasks')
        .set(authHeader(adminToken))
        .send(invalidTask);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Shift');
    });

    it('should validate shift values (1st, 2nd, 3rd)', async () => {
      const invalidTask = {
        aircraft_id: testAircraftId,
        shift: 'invalid-shift',
        description: 'Invalid shift value',
        status: 'In Progress',
        date: '2024-12-01'
      };

      const response = await request(app)
        .post('/tasks')
        .set(authHeader(adminToken))
        .send(invalidTask);

      expect(response.status).toBe(400);
    });

    it('should create task with 1st shift', async () => {
      const newTask = {
        aircraft_id: testAircraftId,
        shift: '1st',
        description: '1st shift task',
        status: 'In Progress',
        date: '2024-12-01'
      };

      const response = await request(app)
        .post('/tasks')
        .set(authHeader(adminToken))
        .send(newTask);

      expect(response.status).toBe(201);
    });

    it('should create task with 2nd shift', async () => {
      const newTask = {
        aircraft_id: testAircraftId,
        shift: '2nd',
        description: '2nd shift task',
        status: 'In Progress',
        date: '2024-12-01'
      };

      const response = await request(app)
        .post('/tasks')
        .set(authHeader(adminToken))
        .send(newTask);

      expect(response.status).toBe(201);
    });

    it('should create task with 3rd shift', async () => {
      const newTask = {
        aircraft_id: testAircraftId,
        shift: '3rd',
        description: '3rd shift task',
        status: 'In Progress',
        date: '2024-12-01'
      };

      const response = await request(app)
        .post('/tasks')
        .set(authHeader(adminToken))
        .send(newTask);

      expect(response.status).toBe(201);
    });

    it('should return 401 for unauthenticated request', async () => {
      const newTask = {
        aircraft_id: testAircraftId,
        shift: '1st',
        description: 'Unauthorized task',
        status: 'In Progress',
        date: '2024-12-01'
      };

      const response = await request(app)
        .post('/tasks')
        .send(newTask);

      expect(response.status).toBe(401);
    });

    it('should handle SQL injection in description', async () => {
      const maliciousTask = {
        aircraft_id: testAircraftId,
        shift: '1st',
        description: "'; DROP TABLE tasks; --",
        status: 'In Progress',
        date: '2024-12-01'
      };

      const response = await request(app)
        .post('/tasks')
        .set(authHeader(adminToken))
        .send(maliciousTask);

      // Should either succeed (sanitized) or return validation error
      expect([201, 400]).toContain(response.status);
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return specific task by id', async () => {
      if (!createdTaskId) {
        const createResponse = await request(app)
          .post('/tasks')
          .set(authHeader(adminToken))
          .send({
            aircraft_id: testAircraftId,
            shift: '1st',
            description: 'Task for GET test',
            status: 'In Progress',
            date: '2024-12-01'
          });
        createdTaskId = createResponse.body.id;
      }

      const response = await request(app)
        .get(`/tasks/${createdTaskId}`)
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(createdTaskId);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .get('/tasks/999999')
        .set(authHeader(adminToken));

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app)
        .get('/tasks/invalid')
        .set(authHeader(adminToken));

      expect(response.status).toBe(400);
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get(`/tasks/${createdTaskId}`);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /tasks/:id', () => {
    let updateTaskId: number;

    beforeAll(async () => {
      const createResponse = await request(app)
        .post('/tasks')
        .set(authHeader(adminToken))
        .send({
          aircraft_id: testAircraftId,
          shift: '1st',
          description: 'Task to update',
          status: 'Pending',
          date: '2024-12-01'
        });
      updateTaskId = createResponse.body.id;
    });

    it('should update task with valid data (admin)', async () => {
      const updatedData = {
        aircraft_id: testAircraftId,
        shift: '2nd',
        description: 'Updated task description',
        status: 'Completed',
        date: '2024-12-02'
      };

      const response = await request(app)
        .put(`/tasks/${updateTaskId}`)
        .set(authHeader(adminToken))
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should update task with valid data (supervisor)', async () => {
      const updatedData = {
        aircraft_id: testAircraftId,
        shift: '3rd',
        description: 'Supervisor updated task',
        status: 'In Progress',
        date: '2024-12-03'
      };

      const response = await request(app)
        .put(`/tasks/${updateTaskId}`)
        .set(authHeader(supervisorToken))
        .send(updatedData);

      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent task', async () => {
      const updatedData = {
        aircraft_id: testAircraftId,
        shift: '1st',
        description: 'Non-existent task',
        status: 'Completed',
        date: '2024-12-01'
      };

      const response = await request(app)
        .put('/tasks/999999')
        .set(authHeader(adminToken))
        .send(updatedData);

      expect(response.status).toBe(404);
    });

    it('should return 400 for missing required fields', async () => {
      const invalidData = {
        shift: '1st'
        // Missing other required fields
      };

      const response = await request(app)
        .put(`/tasks/${updateTaskId}`)
        .set(authHeader(adminToken))
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid id format', async () => {
      const updatedData = {
        aircraft_id: testAircraftId,
        shift: '1st',
        description: 'Update invalid ID',
        status: 'Completed',
        date: '2024-12-01'
      };

      const response = await request(app)
        .put('/tasks/invalid')
        .set(authHeader(adminToken))
        .send(updatedData);

      expect(response.status).toBe(400);
    });

    it('should return 401 for unauthenticated request', async () => {
      const updatedData = {
        aircraft_id: testAircraftId,
        shift: '1st',
        description: 'Unauthorized update',
        status: 'Completed',
        date: '2024-12-01'
      };

      const response = await request(app)
        .put(`/tasks/${updateTaskId}`)
        .send(updatedData);

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /tasks/:id', () => {
    let deleteTaskId: number;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/tasks')
        .set(authHeader(adminToken))
        .send({
          aircraft_id: testAircraftId,
          shift: '1st',
          description: 'Task to delete',
          status: 'Pending',
          date: '2024-12-01'
        });
      deleteTaskId = createResponse.body.id;
    });

    it('should delete task with valid id (admin)', async () => {
      const response = await request(app)
        .delete(`/tasks/${deleteTaskId}`)
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should delete task with valid id (supervisor)', async () => {
      const response = await request(app)
        .delete(`/tasks/${deleteTaskId}`)
        .set(authHeader(supervisorToken));

      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .delete('/tasks/999999')
        .set(authHeader(adminToken));

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app)
        .delete('/tasks/invalid')
        .set(authHeader(adminToken));

      expect(response.status).toBe(400);
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .delete(`/tasks/${deleteTaskId}`);

      expect(response.status).toBe(401);
    });
  });

  // Cleanup
  afterAll(async () => {
    try {
      if (createdTaskId) {
        await request(app)
          .delete(`/tasks/${createdTaskId}`)
          .set(authHeader(adminToken));
      }
      if (testAircraftId) {
        await request(app)
          .delete(`/aircraft/${testAircraftId}`)
          .set(authHeader(adminToken));
      }
    } catch (error) {
      console.log('Cleanup error (can be ignored):', error);
    }
  });
});
