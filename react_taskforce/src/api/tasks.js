/**
 * Tasks API service module.
 * Handles CRUD operations for maintenance tasks.
 */
import api from '../dataSource';

const BASE = '/tasks';

/** Fetch all tasks. */
export const getAllTasks = () => api.get(BASE).then(res => res.data);

/** Fetch a single task by ID. */
export const getTaskById = id => api.get(`${BASE}/${id}`).then(res => res.data);

/** Create a new task. */
export const createTask = data => api.post(BASE, data).then(res => res.data);

/** Update an existing task. */
export const updateTask = (id, data) => api.put(`${BASE}/${id}`, data).then(res => res.data);

/** Delete a task by ID. */
export const deleteTask = id => api.delete(`${BASE}/${id}`);