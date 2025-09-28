import api from '../dataSource';

const BASE = '/api/aircraft';

export const getAllAircraft = () => api.get(BASE).then(res => res.data);
export const getAircraftById = id => api.get(`${BASE}/${id}`).then(res => res.data);
export const createAircraft = data => api.post(BASE, data).then(res => res.data);
export const updateAircraft = (id, data) => api.put(`${BASE}/${id}`, data).then(res => res.data);
export const deleteAircraft = id => api.delete(`${BASE}/${id}`);