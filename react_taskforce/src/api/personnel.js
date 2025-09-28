import api from '../dataSource';

const BASE = '/personnel';

export const getAllPersonnel = () => api.get(BASE).then(res => res.data);
export const getPersonnelById = id => api.get(`${BASE}/${id}`).then(res => res.data);
export const createPersonnel = data => api.post(BASE, data).then(res => res.data);
export const updatePersonnel = (id, data) => api.put(`${BASE}/${id}`, data).then(res => res.data);
export const deletePersonnel = id => api.delete(`${BASE}/${id}`);