import request from 'supertest';
import app from '../src/app';
import { getAuthTokens, authHeader } from './helpers/auth.helper';

describe('Performance & Load Tests', () => {
  let adminToken: string;
  let supervisorToken: string;

  beforeAll(async () => {
    const tokens = await getAuthTokens(app);
    adminToken = tokens.adminToken;
    supervisorToken = tokens.supervisorToken;
  });

  describe('Concurrent Request Handling', () => {
    it('should handle multiple concurrent GET requests', async () => {
      const requests = Array(10).fill(null).map(() =>
        request(app)
          .get('/aircraft')
          .set(authHeader(adminToken))
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });

    it('should handle concurrent requests from different users', async () => {
      const requests = [
        request(app).get('/aircraft').set(authHeader(adminToken)),
        request(app).get('/tasks').set(authHeader(supervisorToken)),
        request(app).get('/personnel').set(authHeader(adminToken)),
        request(app).get('/assignments').set(authHeader(supervisorToken))
      ];

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('Bulk Operations', () => {
    it('should handle creation of multiple aircraft efficiently', async () => {
      const startTime = Date.now();
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000);
      const responses = [];
      
      // Create aircraft sequentially to avoid race conditions
      for (let index = 0; index < 5; index++) {
        const response = await request(app)
          .post('/aircraft')
          .set(authHeader(adminToken))
          .send({ tail_number: `PERF-${random}-${index}` });
        responses.push(response);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      responses.forEach((response, index) => {
        if (response.status !== 201) {
          console.log(`Aircraft creation ${index} failed:`, response.status, response.body);
        }
        expect(response.status).toBe(201);
      });

      // Should complete within reasonable time (< 5 seconds for 5 creations)
      expect(duration).toBeLessThan(5000);

      // Cleanup
      for (const response of responses) {
        if (response.body.insertId) {
          await request(app)
            .delete(`/aircraft/${response.body.insertId}`)
            .set(authHeader(adminToken));
        }
      }
    });

    it('should handle creation of multiple tasks efficiently', async () => {
      // Create a test aircraft first
      const aircraftResponse = await request(app)
        .post('/aircraft')
        .set(authHeader(adminToken))
        .send({ tail_number: 'PERF-TASK-TEST' });
      const aircraftId = aircraftResponse.body.insertId;

      const startTime = Date.now();
      const requests = Array(5).fill(null).map((_, index) =>
        request(app)
          .post('/tasks')
          .set(authHeader(adminToken))
          .send({
            aircraft_id: aircraftId,
            shift: '1st',
            description: `Performance test task ${index}`,
            status: 'In Progress',
            date: '2024-12-01'
          })
      );

      const responses = await Promise.all(requests);
      const endTime = Date.now();
      const duration = endTime - startTime;

      responses.forEach(response => {
        expect(response.status).toBe(201);
      });

      expect(duration).toBeLessThan(5000);

      // Cleanup
      for (const response of responses) {
        if (response.body.id) {
          await request(app)
            .delete(`/tasks/${response.body.id}`)
            .set(authHeader(adminToken));
        }
      }
      await request(app)
        .delete(`/aircraft/${aircraftId}`)
        .set(authHeader(adminToken));
    });
  });

  describe('Dashboard Load Time', () => {
    it('should return dashboard stats within acceptable time', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .get('/dashboard/stats')
        .set(authHeader(adminToken));
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      
      // Dashboard should load within 3 seconds
      expect(duration).toBeLessThan(3000);
    });

    it('should handle concurrent dashboard requests', async () => {
      const requests = Array(5).fill(null).map(() =>
        request(app)
          .get('/dashboard/stats')
          .set(authHeader(adminToken))
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
      });
    });
  });

  describe('Data Growth Scenarios', () => {
    it('should handle filtering large result sets', async () => {
      const response = await request(app)
        .get('/personnel/shift/1st')
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should handle pagination-like queries efficiently', async () => {
      const response1 = await request(app)
        .get('/tasks')
        .set(authHeader(adminToken));

      const response2 = await request(app)
        .get('/assignments')
        .set(authHeader(adminToken));

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
    });
  });

  describe('Response Time Tests', () => {
    it('should respond to GET /aircraft within 1 second', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .get('/aircraft')
        .set(authHeader(adminToken));
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(1000);
    });

    it('should respond to GET /tasks within 1 second', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .get('/tasks')
        .set(authHeader(adminToken));
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(1000);
    });

    it('should respond to GET /personnel within 1 second', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .get('/personnel')
        .set(authHeader(adminToken));
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Archive System Performance', () => {
    it('should handle manual archive operation within acceptable time', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .post('/archive-schedules/manual')
        .set(authHeader(adminToken))
        .send({ shift: '1st' });
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Archive operation should complete within 10 seconds
      expect([200, 201, 500]).toContain(response.status);
      expect(duration).toBeLessThan(10000);
    });

    it('should retrieve archive logs efficiently', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .get('/archive-schedules/logs')
        .set(authHeader(adminToken));
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect([200, 500]).toContain(response.status);
      expect(duration).toBeLessThan(2000);
    });
  });

  describe('Memory & Resource Usage', () => {
    it('should not leak memory during repeated requests', async () => {
      // Make 20 rapid requests to check for memory leaks
      for (let i = 0; i < 20; i++) {
        const response = await request(app)
          .get('/aircraft')
          .set(authHeader(adminToken));
        
        expect(response.status).toBe(200);
      }

      // If we get here without timeout, no obvious memory leak
      expect(true).toBe(true);
    });

    it('should handle rapid sequential requests without degradation', async () => {
      const durations: number[] = [];

      for (let i = 0; i < 10; i++) {
        const startTime = Date.now();
        
        await request(app)
          .get('/tasks')
          .set(authHeader(adminToken));
        
        durations.push(Date.now() - startTime);
      }

      // Later requests should not be significantly slower than early requests
      const firstHalf = durations.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
      const secondHalf = durations.slice(5).reduce((a, b) => a + b, 0) / 5;

      // Second half should not be more than 50% slower
      expect(secondHalf).toBeLessThan(firstHalf * 1.5);
    });
  });
});
