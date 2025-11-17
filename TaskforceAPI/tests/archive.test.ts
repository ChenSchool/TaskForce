import request from 'supertest';
import app from '../src/app';
import { getAuthTokens, authHeader } from './helpers/auth.helper';

describe('Archive System Tests', () => {
  let adminToken: string;
  let supervisorToken: string;

  beforeAll(async () => {
    const tokens = await getAuthTokens(app);
    adminToken = tokens.adminToken;
    supervisorToken = tokens.supervisorToken;
  });

  describe('GET /archive-schedules/schedules', () => {
    it('should get all schedules with admin token', async () => {
      const response = await request(app)
        .get('/archive-schedules/schedules')
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .get('/archive-schedules/schedules');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /archive-schedules/schedules', () => {
    let scheduleId: number;

    it('should create schedule with admin token', async () => {
      const response = await request(app)
        .post('/archive-schedules/schedules')
        .set(authHeader(adminToken))
        .send({
          schedule_time: '14:00:00',
          shift: '2nd',
          enabled: false
        });

      expect(response.status).toBe(201);
      expect(response.body.schedule).toHaveProperty('shift', '2nd');
      expect(response.body.schedule).toHaveProperty('schedule_time', '14:00:00');
      scheduleId = response.body.schedule.id;
    });

    it('should fail with invalid shift', async () => {
      const response = await request(app)
        .post('/archive-schedules/schedules')
        .set(authHeader(adminToken))
        .send({
          schedule_time: '14:00:00',
          shift: '4th', // Invalid
          enabled: false
        });

      expect(response.status).toBe(400);
    });

    // Cleanup
    afterAll(async () => {
      if (scheduleId) {
        await request(app)
          .delete(`/archive-schedules/schedules/${scheduleId}`)
          .set(authHeader(adminToken));
      }
    });
  });

  describe('POST /archive-schedules/manual', () => {
    it('should archive shift with admin token', async () => {
      const response = await request(app)
        .post('/archive-schedules/manual')
        .set(authHeader(adminToken))
        .send({
          shift: '1st'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('shift', '1st');
      expect(response.body).toHaveProperty('assignments_archived');
    });

    it('should fail with invalid shift', async () => {
      const response = await request(app)
        .post('/archive-schedules/manual')
        .set(authHeader(adminToken))
        .send({
          shift: '5th'
        });

      expect(response.status).toBe(400);
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .post('/archive-schedules/manual')
        .send({
          shift: '1st'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /archive-schedules/logs', () => {
    it('should get archive logs with admin token', async () => {
      const response = await request(app)
        .get('/archive-schedules/logs')
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /archive-schedules/archived-assignments', () => {
    it('should get archived assignments', async () => {
      const response = await request(app)
        .get('/archive-schedules/archived-assignments')
        .set(authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
