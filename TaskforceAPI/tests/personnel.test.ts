import request from 'supertest';
import app from '../src/app';
import { getAuthTokens, authHeader } from './helpers/auth.helper';

describe('Personnel API Endpoints', () => {
  let adminToken: string;
  let supervisorToken: string;
  let createdPersonnelId: number;

  beforeAll(async () => {
    const tokens = await getAuthTokens(app);
    adminToken = tokens.adminToken;
    supervisorToken = tokens.supervisorToken;
  });

  describe('GET /personnel', () => {
    it('should return all personnel for authenticated user', async () => {
      const response = await request(app)
        .get('/personnel')
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get('/personnel');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /personnel/shift/:shift', () => {
    it('should return personnel for 1st shift', async () => {
      const response = await request(app)
        .get('/personnel/shift/1st')
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return personnel for 2nd shift', async () => {
      const response = await request(app)
        .get('/personnel/shift/2nd')
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return personnel for 3rd shift', async () => {
      const response = await request(app)
        .get('/personnel/shift/3rd')
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get('/personnel/shift/1st');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /personnel', () => {
    it('should create new personnel with valid data (admin)', async () => {
      const newPersonnel = {
        name: 'Test Person Admin',
        specialty: 'Avionics',
        role: 'Captain',
        shift: '1st'
      };

      const response = await request(app)
        .post('/personnel')
        .set(authHeader(adminToken))
        .send(newPersonnel);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      createdPersonnelId = response.body.id;
    });

    it('should create new personnel with valid data (supervisor)', async () => {
      const newPersonnel = {
        name: 'Test Person Supervisor',
        specialty: 'A&P',
        role: 'Coordinator',
        shift: '2nd'
      };

      const response = await request(app)
        .post('/personnel')
        .set(authHeader(supervisorToken))
        .send(newPersonnel);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 400 for missing name', async () => {
      const invalidPersonnel = {
        specialty: 'Avionics',
        role: 'Captain',
        shift: '1st'
      };

      const response = await request(app)
        .post('/personnel')
        .set(authHeader(adminToken))
        .send(invalidPersonnel);

      expect(response.status).toBe(400);
    });

    it('should return 400 for missing specialty', async () => {
      const invalidPersonnel = {
        name: 'Test Person',
        role: 'Captain',
        shift: '1st'
      };

      const response = await request(app)
        .post('/personnel')
        .set(authHeader(adminToken))
        .send(invalidPersonnel);

      expect(response.status).toBe(400);
    });

    it('should return 400 for missing role', async () => {
      const invalidPersonnel = {
        name: 'Test Person',
        specialty: 'Avionics',
        shift: '1st'
      };

      const response = await request(app)
        .post('/personnel')
        .set(authHeader(adminToken))
        .send(invalidPersonnel);

      expect(response.status).toBe(400);
    });

    it('should return 400 for missing shift', async () => {
      const invalidPersonnel = {
        name: 'Test Person',
        specialty: 'Avionics',
        role: 'Captain'
      };

      const response = await request(app)
        .post('/personnel')
        .set(authHeader(adminToken))
        .send(invalidPersonnel);

      expect(response.status).toBe(400);
    });

    it('should return 400 for empty name', async () => {
      const invalidPersonnel = {
        name: '',
        specialty: 'Avionics',
        role: 'Captain',
        shift: '1st'
      };

      const response = await request(app)
        .post('/personnel')
        .set(authHeader(adminToken))
        .send(invalidPersonnel);

      expect(response.status).toBe(400);
    });

    it('should validate shift values (1st, 2nd, 3rd)', async () => {
      const invalidPersonnel = {
        name: 'Test Person',
        specialty: 'Avionics',
        role: 'Captain',
        shift: 'invalid-shift'
      };

      const response = await request(app)
        .post('/personnel')
        .set(authHeader(adminToken))
        .send(invalidPersonnel);

      expect(response.status).toBe(400);
    });

    it('should create personnel for all valid shifts', async () => {
      const shifts = ['1st', '2nd', '3rd'];
      
      for (const shift of shifts) {
        const newPersonnel = {
          name: `Test Person ${shift}`,
          specialty: 'Avionics',
          role: 'Coordinator',
          shift: shift
        };

        const response = await request(app)
          .post('/personnel')
          .set(authHeader(adminToken))
          .send(newPersonnel);

        expect(response.status).toBe(201);
      }
    });

    it('should create personnel with different roles', async () => {
      const roles = ['Captain', 'Coordinator', 'Collaborator', 'Trainee'];
      
      for (const role of roles) {
        const newPersonnel = {
          name: `Test Person ${role}`,
          specialty: 'Avionics',
          role: role,
          shift: '1st'
        };

        const response = await request(app)
          .post('/personnel')
          .set(authHeader(adminToken))
          .send(newPersonnel);

        expect(response.status).toBe(201);
      }
    });

    it('should return 401 for unauthenticated request', async () => {
      const newPersonnel = {
        name: 'Test Person Unauth',
        specialty: 'Avionics',
        role: 'Captain',
        shift: '1st'
      };

      const response = await request(app)
        .post('/personnel')
        .send(newPersonnel);

      expect(response.status).toBe(401);
    });

    it('should handle SQL injection in name field', async () => {
      const maliciousPersonnel = {
        name: "'; DROP TABLE personnel; --",
        specialty: 'Avionics',
        role: 'Captain',
        shift: '1st'
      };

      const response = await request(app)
        .post('/personnel')
        .set(authHeader(adminToken))
        .send(maliciousPersonnel);

      // Should either succeed (sanitized) or return validation error
      expect([201, 400]).toContain(response.status);
    });
  });

  describe('GET /personnel/:id', () => {
    it('should return specific personnel by id', async () => {
      if (!createdPersonnelId) {
        const createResponse = await request(app)
          .post('/personnel')
          .set(authHeader(adminToken))
          .send({
            name: 'Test Person GET',
            specialty: 'Avionics',
            role: 'Captain',
            shift: '1st'
          });
        createdPersonnelId = createResponse.body.id;
      }

      const response = await request(app)
        .get(`/personnel/${createdPersonnelId}`)
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(createdPersonnelId);
    });

    it('should return 404 for non-existent personnel', async () => {
      const response = await request(app)
        .get('/personnel/999999')
        .set(authHeader(adminToken));

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app)
        .get('/personnel/invalid')
        .set(authHeader(adminToken));

      expect(response.status).toBe(400);
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get(`/personnel/${createdPersonnelId}`);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /personnel/:id', () => {
    let updatePersonnelId: number;

    beforeAll(async () => {
      const createResponse = await request(app)
        .post('/personnel')
        .set(authHeader(adminToken))
        .send({
          name: 'Test Person Update',
          specialty: 'Avionics',
          role: 'Captain',
          shift: '1st'
        });
      updatePersonnelId = createResponse.body.id;
    });

    it('should update personnel with valid data (admin)', async () => {
      const updatedData = {
        name: 'Test Person Updated',
        specialty: 'A&P',
        role: 'Coordinator',
        shift: '2nd'
      };

      const response = await request(app)
        .put(`/personnel/${updatePersonnelId}`)
        .set(authHeader(adminToken))
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should update personnel with valid data (supervisor)', async () => {
      const updatedData = {
        name: 'Test Person Supervisor Update',
        specialty: 'Integration',
        role: 'Trainee',
        shift: '3rd'
      };

      const response = await request(app)
        .put(`/personnel/${updatePersonnelId}`)
        .set(authHeader(supervisorToken))
        .send(updatedData);

      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent personnel', async () => {
      const updatedData = {
        name: 'Non-existent Person',
        specialty: 'Avionics',
        role: 'Captain',
        shift: '1st'
      };

      const response = await request(app)
        .put('/personnel/999999')
        .set(authHeader(adminToken))
        .send(updatedData);

      expect(response.status).toBe(404);
    });

    it('should return 400 for missing required fields', async () => {
      const invalidData = {
        name: 'Test Person'
        // Missing specialty, role, shift
      };

      const response = await request(app)
        .put(`/personnel/${updatePersonnelId}`)
        .set(authHeader(adminToken))
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid id format', async () => {
      const updatedData = {
        name: 'Test Person',
        specialty: 'Avionics',
        role: 'Captain',
        shift: '1st'
      };

      const response = await request(app)
        .put('/personnel/invalid')
        .set(authHeader(adminToken))
        .send(updatedData);

      expect(response.status).toBe(400);
    });

    it('should return 401 for unauthenticated request', async () => {
      const updatedData = {
        name: 'Test Person Unauth',
        specialty: 'Avionics',
        role: 'Captain',
        shift: '1st'
      };

      const response = await request(app)
        .put(`/personnel/${updatePersonnelId}`)
        .send(updatedData);

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /personnel/:id', () => {
    let deletePersonnelId: number;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/personnel')
        .set(authHeader(adminToken))
        .send({
          name: 'Test Person Delete',
          specialty: 'Avionics',
          role: 'Captain',
          shift: '1st'
        });
      deletePersonnelId = createResponse.body.id;
    });

    it('should delete personnel with valid id (admin)', async () => {
      const response = await request(app)
        .delete(`/personnel/${deletePersonnelId}`)
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should delete personnel with valid id (supervisor)', async () => {
      const response = await request(app)
        .delete(`/personnel/${deletePersonnelId}`)
        .set(authHeader(supervisorToken));

      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent personnel', async () => {
      const response = await request(app)
        .delete('/personnel/999999')
        .set(authHeader(adminToken));

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app)
        .delete('/personnel/invalid')
        .set(authHeader(adminToken));

      expect(response.status).toBe(400);
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .delete(`/personnel/${deletePersonnelId}`);

      expect(response.status).toBe(401);
    });
  });

  // Cleanup
  afterAll(async () => {
    try {
      if (createdPersonnelId) {
        await request(app)
          .delete(`/personnel/${createdPersonnelId}`)
          .set(authHeader(adminToken));
      }
    } catch (error) {
      console.log('Cleanup error (can be ignored):', error);
    }
  });
});
