const BASE = '/api/tasks';
export const getAllTasks = () => fetch(BASE).then(r=>r.json());
export const getTaskById = id => fetch(`${BASE}/${id}`).then(r=>r.json());
export const createTask = data => fetch(BASE, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) }).then(r=>r.json());
export const updateTask = (id,data) => fetch(`${BASE}/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) }).then(r=>r.json());
export const deleteTask = id => fetch(`${BASE}/${id}`, { method:'DELETE' });