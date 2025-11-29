/**
 * Users API service module.
 * Handles user management operations including profile updates, password changes, and dark mode preferences.
 */
import { API_BASE } from '../dataSource';

/**
 * Helper function to construct authorization headers with JWT token.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

/**
 * Fetch all user accounts.
 */
export const getAllUsers = async () => {
  const response = await fetch(`${API_BASE}/users`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  
  return response.json();
};

/**
 * Fetch a single user by ID.
 */
export const getUserById = async (id) => {
  const response = await fetch(`${API_BASE}/users/${id}`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  
  return response.json();
};

/**
 * Update user profile information (name, email, role).
 */
export const updateUser = async (id, data) => {
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update user');
  }
  
  return response.json();
};

/**
 * Change user password with current password verification.
 */
export const changePassword = async (id, currentPassword, newPassword) => {
  const response = await fetch(`${API_BASE}/users/${id}/password`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ currentPassword, newPassword })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to change password');
  }
  
  return response.json();
};

/**
 * Update user's dark mode preference.
 */
export const updateDarkMode = async (id, darkMode) => {
  const response = await fetch(`${API_BASE}/users/${id}/dark-mode`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ darkMode })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update dark mode preference');
  }
  
  return response.json();
};

/**
 * Deactivate (soft delete) a user account.
 */
export const deactivateUser = async (id) => {
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to deactivate user');
  }
  
  return response.json();
};
