/**
 * Aircraft API service
 * Handles all HTTP requests for aircraft CRUD operations
 */
import api from '../dataSource';

const BASE = '/aircraft';

// Fetch all aircraft records
export const getAllAircraft = () => api.get(BASE).then(res => res.data);

// Fetch single aircraft by ID
export const getAircraftById = id => api.get(`${BASE}/${id}`).then(res => res.data);

// Create new aircraft record
export const createAircraft = data => api.post(BASE, data).then(res => res.data);

// Update existing aircraft record
export const updateAircraft = (id, data) => api.put(`${BASE}/${id}`, data).then(res => res.data);

// Delete aircraft record
export const deleteAircraft = id => api.delete(`${BASE}/${id}`);