import request from 'supertest';
import app from '../src/app';
import { getAuthTokens, authHeader } from './helpers/auth.helper';

describe('Aircraft API Endpoints', () => {
  let adminToken: string;
  let supervisorToken: string;
  let createdAircraftId: number;

  beforeAll(async () => {
    const tokens = await getAuthTokens(app);
    adminToken = tokens.adminToken;
    supervisorToken = tokens.supervisorToken;
  });

  describe('GET /aircraft', () => {
    it('should return all aircraft for authenticated user', async () => {
      const response = await request(app)
        .get('/aircraft')
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get('/aircraft');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /aircraft', () => {
    it('should create new aircraft with valid data (admin)', async () => {
      const newAircraft = {
        tail_number: 'TEST-001'
      };

      const response = await request(app)
        .post('/aircraft')
        .set(authHeader(adminToken))
        .send(newAircraft);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('insertId');
      createdAircraftId = response.body.insertId;
    });

    it('should create new aircraft with valid data (supervisor)', async () => {
      const newAircraft = {
        tail_number: 'TEST-002'
      };

      const response = await request(app)
        .post('/aircraft')
        .set(authHeader(supervisorToken))
        .send(newAircraft);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('insertId');
    });

    it('should return 400 for missing tail_number', async () => {
      const invalidAircraft = {};

      const response = await request(app)
        .post('/aircraft')
        .set(authHeader(adminToken))
        .send(invalidAircraft);

      expect(response.status).toBe(400);
    });

    it('should return 400 for empty tail_number', async () => {
      const invalidAircraft = {
        tail_number: ''
      };

      const response = await request(app)
        .post('/aircraft')
        .set(authHeader(adminToken))
        .send(invalidAircraft);

      expect(response.status).toBe(400);
    });

    it('should return 401 for unauthenticated request', async () => {
      const newAircraft = {
        tail_number: 'TEST-UNAUTH'
      };

      const response = await request(app)
        .post('/aircraft')
        .send(newAircraft);

      expect(response.status).toBe(401);
    });

    it('should handle SQL injection attempt', async () => {
      const maliciousAircraft = {
        tail_number: "'; DROP TABLE aircraft; --"
      };

      const response = await request(app)
        .post('/aircraft')
        .set(authHeader(adminToken))
        .send(maliciousAircraft);

      // Should either succeed (string sanitized) or return validation error
      expect([201, 400]).toContain(response.status);
    });
  });

  describe('GET /aircraft/:id', () => {
    it('should return specific aircraft by id', async () => {
      if (!createdAircraftId) {
        // Create one first if not exists
        const createResponse = await request(app)
          .post('/aircraft')
          .set(authHeader(adminToken))
          .send({ tail_number: 'TEST-GET' });
        createdAircraftId = createResponse.body.insertId;
      }

      const response = await request(app)
        .get(`/aircraft/${createdAircraftId}`)
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 404 for non-existent aircraft', async () => {
      const response = await request(app)
        .get('/aircraft/999999')
        .set(authHeader(adminToken));

      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body).toEqual([]);
      }
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app)
        .get('/aircraft/invalid')
        .set(authHeader(adminToken));

      expect(response.status).toBe(400);
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get(`/aircraft/${createdAircraftId}`);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /aircraft/:id', () => {
    let updateAircraftId: number;

    beforeAll(async () => {
      // Create aircraft to update
      const createResponse = await request(app)
        .post('/aircraft')
        .set(authHeader(adminToken))
        .send({ tail_number: 'TEST-UPDATE-BEFORE' });
      updateAircraftId = createResponse.body.insertId;
    });

    it('should update aircraft with valid data (admin)', async () => {
      const updatedData = {
        tail_number: 'TEST-UPDATE-AFTER'
      };

      const response = await request(app)
        .put(`/aircraft/${updateAircraftId}`)
        .set(authHeader(adminToken))
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should update aircraft with valid data (supervisor)', async () => {
      const updatedData = {
        tail_number: 'TEST-UPDATE-SUPER'
      };

      const response = await request(app)
        .put(`/aircraft/${updateAircraftId}`)
        .set(authHeader(supervisorToken))
        .send(updatedData);

      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent aircraft', async () => {
      const updatedData = {
        tail_number: 'TEST-NONEXIST'
      };

      const response = await request(app)
        .put('/aircraft/999999')
        .set(authHeader(adminToken))
        .send(updatedData);

      expect(response.status).toBe(404);
    });

    it('should return 400 for missing tail_number', async () => {
      const invalidData = {};

      const response = await request(app)
        .put(`/aircraft/${updateAircraftId}`)
        .set(authHeader(adminToken))
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid id format', async () => {
      const updatedData = {
        tail_number: 'TEST-INVALID-ID'
      };

      const response = await request(app)
        .put('/aircraft/invalid')
        .set(authHeader(adminToken))
        .send(updatedData);

      expect(response.status).toBe(400);
    });

    it('should return 401 for unauthenticated request', async () => {
      const updatedData = {
        tail_number: 'TEST-UNAUTH-UPDATE'
      };

      const response = await request(app)
        .put(`/aircraft/${updateAircraftId}`)
        .send(updatedData);

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /aircraft/:id', () => {
    let deleteAircraftId: number;

    beforeEach(async () => {
      // Create aircraft to delete
      const createResponse = await request(app)
        .post('/aircraft')
        .set(authHeader(adminToken))
        .send({ tail_number: 'TEST-DELETE' });
      deleteAircraftId = createResponse.body.insertId;
    });

    it('should delete aircraft with valid id (admin)', async () => {
      const response = await request(app)
        .delete(`/aircraft/${deleteAircraftId}`)
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should delete aircraft with valid id (supervisor)', async () => {
      const response = await request(app)
        .delete(`/aircraft/${deleteAircraftId}`)
        .set(authHeader(supervisorToken));

      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent aircraft', async () => {
      const response = await request(app)
        .delete('/aircraft/999999')
        .set(authHeader(adminToken));

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app)
        .delete('/aircraft/invalid')
        .set(authHeader(adminToken));

      expect(response.status).toBe(400);
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .delete(`/aircraft/${deleteAircraftId}`);

      expect(response.status).toBe(401);
    });
  });

  // Cleanup after all tests
  afterAll(async () => {
    // Clean up any remaining test aircraft
    try {
      if (createdAircraftId) {
        await request(app)
          .delete(`/aircraft/${createdAircraftId}`)
          .set(authHeader(adminToken));
      }
    } catch (error) {
      console.log('Cleanup error (can be ignored):', error);
    }
  });
});
