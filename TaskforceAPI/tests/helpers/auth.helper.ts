import request from 'supertest';

export interface TestTokens {
  adminToken: string;
  supervisorToken: string;
}

/**
 * Get authentication tokens for testing
 * NOTE: Update the credentials based on your test database
 */
export async function getAuthTokens(app: any): Promise<TestTokens> {
  // Login as admin (Manager role)
  const adminResponse = await request(app)
    .post('/auth/login')
    .send({
      username: 'admin',  
      password: 'admin123' 
    });

  // Login as supervisor
  const supervisorResponse = await request(app)
    .post('/auth/login')
    .send({
      username: 'supervisor', 
      password: 'password'    
    });

  return {
    adminToken: adminResponse.body.accessToken || adminResponse.body.token,
    supervisorToken: supervisorResponse.body.accessToken || supervisorResponse.body.token
  };
}

export function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}
