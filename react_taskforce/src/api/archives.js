import api from '../dataSource';

const BASE = '/archives';

export const getAllArchives = () => api.get(BASE).then(res => res.data);
export const getArchiveById = id => api.get(`${BASE}/${id}`).then(res => res.data);
export const createArchive = data => api.post(BASE, data).then(res => res.data);
export const deleteArchive = id => api.delete(`${BASE}/${id}`);
