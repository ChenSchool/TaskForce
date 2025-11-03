import { API_BASE } from '../dataSource';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const getAllUsers = async () => {
  const response = await fetch(`${API_BASE}/users`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  
  return response.json();
};

export const getUserById = async (id) => {
  const response = await fetch(`${API_BASE}/users/${id}`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  
  return response.json();
};

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
