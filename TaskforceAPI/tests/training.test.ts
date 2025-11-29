import request from 'supertest';
import app from '../src/app';
import { getAuthTokens, authHeader } from './helpers/auth.helper';

describe('Training API Endpoints', () => {
  let adminToken: string;
  let supervisorToken: string;
  let testPersonnelId: number;
  let createdTrainingId: number;

  beforeAll(async () => {
    const tokens = await getAuthTokens(app);
    adminToken = tokens.adminToken;
    supervisorToken = tokens.supervisorToken;

    // Create test personnel for training
    const personnelResponse = await request(app)
      .post('/personnel')
      .set(authHeader(adminToken))
      .send({
        name: 'Test Person Training',
        specialty: 'Avionics',
        role: 'Coordinator',
        shift: '1st'
      });
    testPersonnelId = personnelResponse.body.id;
  });

  describe('GET /training', () => {
    it('should return all training records for authenticated user', async () => {
      const response = await request(app)
        .get('/training')
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get('/training');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /training/stats', () => {
    it('should return training statistics', async () => {
      const response = await request(app)
        .get('/training/stats')
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get('/training/stats');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /training', () => {
    it('should create new training record with valid data', async () => {
      const newTraining = {
        personnel_id: testPersonnelId,
        phase: 'Phase 1',
        progress: 0,
        complete: false
      };

      const response = await request(app)
        .post('/training')
        .set(authHeader(adminToken))
        .send(newTraining);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      createdTrainingId = response.body.id;
    });

    it('should return 400 for missing personnel_id', async () => {
      const invalidTraining = {
        phase: 'Phase 1',
        progress: 0,
        complete: false
      };

      const response = await request(app)
        .post('/training')
        .set(authHeader(adminToken))
        .send(invalidTraining);

      expect(response.status).toBe(400);
    });

    it('should return 400 for missing phase', async () => {
      const invalidTraining = {
        personnel_id: testPersonnelId,
        progress: 0,
        complete: false
      };

      const response = await request(app)
        .post('/training')
        .set(authHeader(adminToken))
        .send(invalidTraining);

      expect(response.status).toBe(400);
    });

    it('should create training record for different phases', async () => {
      const phases = ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5'];
      
      for (const phase of phases) {
        const newTraining = {
          personnel_id: testPersonnelId,
          phase: phase,
          progress: 0,
          complete: false
        };

        const response = await request(app)
          .post('/training')
          .set(authHeader(adminToken))
          .send(newTraining);

        expect(response.status).toBe(201);
      }
    });

    it('should return 401 for unauthenticated request', async () => {
      const newTraining = {
        personnel_id: testPersonnelId,
        phase: 'Phase 1',
        progress: 0,
        complete: false
      };

      const response = await request(app)
        .post('/training')
        .send(newTraining);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /training/:id', () => {
    it('should return specific training record by id', async () => {
      if (!createdTrainingId) {
        const createResponse = await request(app)
          .post('/training')
          .set(authHeader(adminToken))
          .send({
            personnel_id: testPersonnelId,
            phase: 'Phase 1',
            progress: 0,
            complete: false
          });
        createdTrainingId = createResponse.body.id;
      }

      const response = await request(app)
        .get(`/training/${createdTrainingId}`)
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 404 for non-existent training record', async () => {
      const response = await request(app)
        .get('/training/999999')
        .set(authHeader(adminToken));

      expect(response.status).toBe(404);
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get(`/training/${createdTrainingId}`);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /training/personnel/:personnelId', () => {
    it('should return training records for specific personnel', async () => {
      const response = await request(app)
        .get(`/training/personnel/${testPersonnelId}`)
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get(`/training/personnel/${testPersonnelId}`);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /training/:id', () => {
    let updateTrainingId: number;

    beforeAll(async () => {
      const createResponse = await request(app)
        .post('/training')
        .set(authHeader(adminToken))
        .send({
          personnel_id: testPersonnelId,
          phase: 'Phase 1',
          progress: 0,
          complete: false
        });
      updateTrainingId = createResponse.body.id;
    });

    it('should update training record with progress', async () => {
      const updatedData = {
        personnel_id: testPersonnelId,
        phase: 'Phase 1',
        progress: 50,
        complete: false
      };

      const response = await request(app)
        .put(`/training/${updateTrainingId}`)
        .set(authHeader(adminToken))
        .send(updatedData);

      expect(response.status).toBe(200);
    });

    it('should update training record as complete', async () => {
      const updatedData = {
        personnel_id: testPersonnelId,
        phase: 'Phase 1',
        progress: 100,
        complete: true
      };

      const response = await request(app)
        .put(`/training/${updateTrainingId}`)
        .set(authHeader(adminToken))
        .send(updatedData);

      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent training record', async () => {
      const updatedData = {
        personnel_id: testPersonnelId,
        phase: 'Phase 1',
        progress: 50,
        complete: false
      };

      const response = await request(app)
        .put('/training/999999')
        .set(authHeader(adminToken))
        .send(updatedData);

      expect(response.status).toBe(404);
    });

    it('should return 401 for unauthenticated request', async () => {
      const updatedData = {
        personnel_id: testPersonnelId,
        phase: 'Phase 1',
        progress: 50,
        complete: false
      };

      const response = await request(app)
        .put(`/training/${updateTrainingId}`)
        .send(updatedData);

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /training/:id', () => {
    let deleteTrainingId: number;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/training')
        .set(authHeader(adminToken))
        .send({
          personnel_id: testPersonnelId,
          phase: 'Phase 1',
          progress: 0,
          complete: false
        });
      deleteTrainingId = createResponse.body.id;
    });

    it('should delete training record with valid id', async () => {
      const response = await request(app)
        .delete(`/training/${deleteTrainingId}`)
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 for non-existent training record', async () => {
      const response = await request(app)
        .delete('/training/999999')
        .set(authHeader(adminToken));

      expect(response.status).toBe(404);
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .delete(`/training/${deleteTrainingId}`);

      expect(response.status).toBe(401);
    });
  });

  // Cleanup
  afterAll(async () => {
    try {
      if (createdTrainingId) {
        await request(app)
          .delete(`/training/${createdTrainingId}`)
          .set(authHeader(adminToken));
      }
      if (testPersonnelId) {
        await request(app)
          .delete(`/personnel/${testPersonnelId}`)
          .set(authHeader(adminToken));
      }
    } catch (error) {
      console.log('Cleanup error (can be ignored):', error);
    }
  });
});
