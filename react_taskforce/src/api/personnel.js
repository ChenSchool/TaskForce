/**
 * Personnel API service module.
 * Handles CRUD operations for personnel records.
 */
import api from '../dataSource';

const BASE = '/personnel';

/** Fetch all personnel records. */
export const getAllPersonnel = () => api.get(BASE).then(res => res.data);

/** Fetch a single personnel record by ID. */

/** Fetch a single personnel record by ID. */
export const getPersonnelById = id => api.get(`${BASE}/${id}`).then(res => res.data);

/** Create a new personnel record. */
export const createPersonnel = data => api.post(BASE, data).then(res => res.data);

/** Update an existing personnel record. */
export const updatePersonnel = (id, data) => api.put(`${BASE}/${id}`, data).then(res => res.data);

/** Delete a personnel record by ID. */
export const deletePersonnel = id => api.delete(`${BASE}/${id}`);