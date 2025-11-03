import api from '../dataSource';

const BASE = '/assignments';

export const getAllAssignments = () => api.get(BASE).then(res => res.data);
export const getAssignmentById = id => api.get(`${BASE}/${id}`).then(res => res.data);
export const getAssignmentsByPersonnelId = personnelId => api.get(`${BASE}/personnel/${personnelId}`).then(res => res.data);
export const deleteAssignmentsByPersonnelId = personnelId => api.delete(`${BASE}/personnel/${personnelId}`).then(res => res.data);
export const createAssignment = data => api.post(BASE, data).then(res => res.data);
export const updateAssignment = (id, data) => api.put(`${BASE}/${id}`, data).then(res => res.data);
export const deleteAssignment = id => api.delete(`${BASE}/${id}`);