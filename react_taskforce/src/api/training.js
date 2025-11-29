/**
 * Training API service module.
 * Handles CRUD operations for training records and training statistics.
 */
import api from '../dataSource';

const BASE = '/training';

/** Fetch all training records. */
export const getAllTraining = () => api.get(BASE).then(res => res.data);

/** Fetch a single training record by ID. */
export const getTrainingById = id => api.get(`${BASE}/${id}`).then(res => res.data);

/** Fetch all training records for a specific personnel member. */
export const getTrainingByPersonnelId = personnelId => api.get(`${BASE}/personnel/${personnelId}`).then(res => res.data);

/** Fetch training completion statistics. */
export const getTrainingStats = () => api.get(`${BASE}/stats`).then(res => res.data);

/** Create a new training record. */
export const createTraining = data => api.post(BASE, data).then(res => res.data);

/** Update an existing training record. */
export const updateTraining = (id, data) => api.put(`${BASE}/${id}`, data).then(res => res.data);

/** Delete a training record by ID. */
export const deleteTraining = id => api.delete(`${BASE}/${id}`);
