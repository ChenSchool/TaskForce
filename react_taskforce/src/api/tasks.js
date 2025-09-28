import api from '../dataSource';

const BASE = '/tasks';

export const getAllTasks = () => api.get(BASE).then(res => res.data);
export const getTaskById = id => api.get(`${BASE}/${id}`).then(res => res.data);
export const createTask = data => api.post(BASE, data).then(res => res.data);
export const updateTask = (id, data) => api.put(`${BASE}/${id}`, data).then(res => res.data);
export const deleteTask = id => api.delete(`${BASE}/${id}`);