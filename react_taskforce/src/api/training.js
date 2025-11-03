import api from '../dataSource';

const BASE = '/training';

export const getAllTraining = () => api.get(BASE).then(res => res.data);
export const getTrainingById = id => api.get(`${BASE}/${id}`).then(res => res.data);
export const getTrainingByPersonnelId = personnelId => api.get(`${BASE}/personnel/${personnelId}`).then(res => res.data);
export const getTrainingStats = () => api.get(`${BASE}/stats`).then(res => res.data);
export const createTraining = data => api.post(BASE, data).then(res => res.data);
export const updateTraining = (id, data) => api.put(`${BASE}/${id}`, data).then(res => res.data);
export const deleteTraining = id => api.delete(`${BASE}/${id}`);
