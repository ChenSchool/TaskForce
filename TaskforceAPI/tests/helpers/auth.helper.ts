import request from 'supertest';

export interface TestTokens {
  adminToken: string;
  supervisorToken: string;
}

/**
 * Get authentication tokens for testing
 * Uses seeded test data from testDb.ts
 */
export async function getAuthTokens(app: any): Promise<TestTokens> {
  // Login as admin (Manager role) - seeded in testDb
  const adminResponse = await request(app)
    .post('/auth/login')
    .send({
      username: 'testadmin',  
      password: 'TestPass123!' 
    });

  // Login as supervisor - seeded in testDb
  const supervisorResponse = await request(app)
    .post('/auth/login')
    .send({
      username: 'testsupervisor', 
      password: 'TestPass123!'    
    });

  if (!adminResponse.body.accessToken || !supervisorResponse.body.accessToken) {
    throw new Error('Failed to get auth tokens. Check test database seed data.');
  }

  return {
    adminToken: adminResponse.body.accessToken || adminResponse.body.token,
    supervisorToken: supervisorResponse.body.accessToken || supervisorResponse.body.token
  };
}

export function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}
