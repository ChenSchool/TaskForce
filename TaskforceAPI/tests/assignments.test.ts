import request from 'supertest';
import app from '../src/app';
import { getAuthTokens, authHeader } from './helpers/auth.helper';

describe('Assignments API Endpoints', () => {
  let adminToken: string;
  let supervisorToken: string;
  let testAircraftId: number;
  let testTaskId: number;
  let testPersonnelId: number;
  let createdAssignmentId: number;

  beforeAll(async () => {
    const tokens = await getAuthTokens(app);
    adminToken = tokens.adminToken;
    supervisorToken = tokens.supervisorToken;

    // Create test aircraft
    const aircraftResponse = await request(app)
      .post('/aircraft')
      .set(authHeader(adminToken))
      .send({ tail_number: 'TEST-ASSIGN-AIRCRAFT' });
    testAircraftId = aircraftResponse.body.insertId;

    // Create test task
    const taskResponse = await request(app)
      .post('/tasks')
      .set(authHeader(adminToken))
      .send({
        aircraft_id: testAircraftId,
        shift: '1st',
        description: 'Test task for assignments',
        status: 'In Progress',
        date: '2024-12-01'
      });
    testTaskId = taskResponse.body.id;

    // Create test personnel
    const personnelResponse = await request(app)
      .post('/personnel')
      .set(authHeader(adminToken))
      .send({
        name: 'Test Person For Assignment',
        specialty: 'Avionics',
        role: 'Captain',
        shift: '1st'
      });
    testPersonnelId = personnelResponse.body.id;
  });

  describe('GET /assignments', () => {
    it('should return all assignments for authenticated user', async () => {
      const response = await request(app)
        .get('/assignments')
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get('/assignments');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /assignments', () => {
    it('should create new assignment with valid data', async () => {
      const newAssignment = {
        task_id: testTaskId,
        lines: [
          {
            personnel_id: testPersonnelId,
            role: 'Captain'
          }
        ]
      };

      const response = await request(app)
        .post('/assignments')
        .set(authHeader(adminToken))
        .send(newAssignment);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('ids');
      if (response.body.ids && response.body.ids.length > 0) {
        createdAssignmentId = response.body.ids[0];
      }
    });

    it('should return 400 for missing task_id', async () => {
      const invalidAssignment = {
        lines: [
          {
            personnel_id: testPersonnelId,
            role: 'Captain'
          }
        ]
      };

      const response = await request(app)
        .post('/assignments')
        .set(authHeader(adminToken))
        .send(invalidAssignment);

      expect(response.status).toBe(400);
    });

    it('should return 400 for missing lines array', async () => {
      const invalidAssignment = {
        task_id: testTaskId
      };

      const response = await request(app)
        .post('/assignments')
        .set(authHeader(adminToken))
        .send(invalidAssignment);

      expect(response.status).toBe(400);
    });

    it('should return 401 for unauthenticated request', async () => {
      const newAssignment = {
        task_id: testTaskId,
        lines: [
          {
            personnel_id: testPersonnelId,
            role: 'Captain'
          }
        ]
      };

      const response = await request(app)
        .post('/assignments')
        .send(newAssignment);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /assignments/task/:taskId', () => {
    it('should return assignments for a specific task', async () => {
      const response = await request(app)
        .get(`/assignments/task/${testTaskId}`)
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('task_id');
      expect(response.body).toHaveProperty('lines');
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get(`/assignments/task/${testTaskId}`);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /assignments/personnel/:personnelId', () => {
    it('should return assignments for a specific personnel', async () => {
      const response = await request(app)
        .get(`/assignments/personnel/${testPersonnelId}`)
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get(`/assignments/personnel/${testPersonnelId}`);

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /assignments/personnel/:personnelId', () => {
    it('should delete all assignments for a personnel member', async () => {
      const response = await request(app)
        .delete(`/assignments/personnel/${testPersonnelId}`)
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .delete(`/assignments/personnel/${testPersonnelId}`);

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /assignments/:id', () => {
    let deleteAssignmentId: number;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/assignments')
        .set(authHeader(adminToken))
        .send({
          task_id: testTaskId,
          lines: [
            {
              personnel_id: testPersonnelId,
              role: 'Technician'
            }
          ]
        });
      if (createResponse.body.ids && createResponse.body.ids.length > 0) {
        deleteAssignmentId = createResponse.body.ids[0];
      }
    });

    it('should delete assignment with valid id', async () => {
      if (!deleteAssignmentId) {
        return; // Skip if no assignment was created
      }

      const response = await request(app)
        .delete(`/assignments/${deleteAssignmentId}`)
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 for non-existent assignment', async () => {
      const response = await request(app)
        .delete('/assignments/999999')
        .set(authHeader(adminToken));

      expect(response.status).toBe(404);
    });

    it('should return 401 for unauthenticated request', async () => {
      if (!deleteAssignmentId) {
        return;
      }

      const response = await request(app)
        .delete(`/assignments/${deleteAssignmentId}`);

      expect(response.status).toBe(401);
    });
  });

  // Cleanup
  afterAll(async () => {
    try {
      if (testPersonnelId) {
        await request(app)
          .delete(`/personnel/${testPersonnelId}`)
          .set(authHeader(adminToken));
      }
      if (testTaskId) {
        await request(app)
          .delete(`/tasks/${testTaskId}`)
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
