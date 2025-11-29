/**
 * Archives API service
 * Manages archived task and assignment records
 */
import api from '../dataSource';

const BASE = '/archives';

// Fetch all archived records
export const getAllArchives = () => api.get(BASE).then(res => res.data);

// Fetch single archive by ID
export const getArchiveById = id => api.get(`${BASE}/${id}`).then(res => res.data);

// Create new archive entry
export const createArchive = data => api.post(BASE, data).then(res => res.data);

// Delete archive entry
export const deleteArchive = id => api.delete(`${BASE}/${id}`);
