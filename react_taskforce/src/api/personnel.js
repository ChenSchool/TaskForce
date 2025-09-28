const BASE = '/api/personnel';
export const getAllPersonnel = () => fetch(BASE).then(r=>r.json());
export const getPersonnelById = id => fetch(`${BASE}/${id}`).then(r=>r.json());
export const createPersonnel = d => fetch(BASE, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) }).then(r=>r.json());
export const updatePersonnel = (id,d) => fetch(`${BASE}/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) }).then(r=>r.json());
export const deletePersonnel = id => fetch(`${BASE}/${id}`, { method:'DELETE' });