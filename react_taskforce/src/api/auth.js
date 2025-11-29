/**
 * Authentication API service module.
 * Handles all authentication-related HTTP requests including login, registration, logout, token refresh, and user profile retrieval.
 */
import { API_BASE } from '../dataSource';

/**
 * Authenticate user with username and password.
 */
export const login = async (username, password) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  
  return response.json();
};

/**
 * Register a new user account.
 */
export const register = async (userData) => {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }
  
  return response.json();
};

/**
 * Logout user and invalidate refresh token.
 */
export const logout = async (refreshToken) => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ refreshToken })
  });
  
  return response.json();
};

/**
 * Refresh access token using refresh token.
 */
export const refreshToken = async (refreshToken) => {
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  
  if (!response.ok) {
    throw new Error('Token refresh failed');
  }
  
  return response.json();
};

/**
 * Get the current authenticated user's profile information.
 */
export const getCurrentUser = async () => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to get current user');
  }
  
  return response.json();
};
