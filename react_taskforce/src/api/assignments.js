const BASE = '/api/assignments';
export const getAllAssignments = () => fetch(BASE).then(r=>r.json());
export const getAssignmentById = id => fetch(`${BASE}/${id}`).then(r=>r.json());
export const createAssignment = d => fetch(BASE, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) }).then(r=>r.json());
export const updateAssignment = (id,d) => fetch(`${BASE}/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) }).then(r=>r.json());
export const deleteAssignment = id => fetch(`${BASE}/${id}`, { method:'DELETE' });