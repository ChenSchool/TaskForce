/**
 * Assignments API service
 * Manages task assignments to personnel
 */
import api from '../dataSource';

const BASE = '/assignments';

// Fetch all assignments
export const getAllAssignments = () => api.get(BASE).then(res => res.data);

// Fetch single assignment by ID
export const getAssignmentById = id => api.get(`${BASE}/${id}`).then(res => res.data);

// Fetch all assignments for specific personnel
export const getAssignmentsByPersonnelId = personnelId => api.get(`${BASE}/personnel/${personnelId}`).then(res => res.data);

// Delete all assignments for specific personnel
export const deleteAssignmentsByPersonnelId = personnelId => api.delete(`${BASE}/personnel/${personnelId}`).then(res => res.data);

// Create new assignment
export const createAssignment = data => api.post(BASE, data).then(res => res.data);

// Update existing assignment
export const updateAssignment = (id, data) => api.put(`${BASE}/${id}`, data).then(res => res.data);

// Delete assignment
export const deleteAssignment = id => api.delete(`${BASE}/${id}`);