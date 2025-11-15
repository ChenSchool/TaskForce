import api from '../dataSource';

const BASE = '/archive-schedules';

// Schedule management
export const getAllSchedules = () => api.get(`${BASE}/schedules`).then(res => res.data);
export const getScheduleById = id => api.get(`${BASE}/schedules/${id}`).then(res => res.data);
export const createSchedule = data => api.post(`${BASE}/schedules`, data).then(res => res.data);
export const updateSchedule = (id, data) => api.put(`${BASE}/schedules/${id}`, data).then(res => res.data);
export const deleteSchedule = id => api.delete(`${BASE}/schedules/${id}`);

// Manual archive
export const manualArchive = data => api.post(`${BASE}/manual`, data).then(res => res.data);

// Archive logs and history
export const getArchiveLogs = () => api.get(`${BASE}/logs`).then(res => res.data);
export const getArchivedAssignments = (startDate, endDate) => {
  const params = {};
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;
  return api.get(`${BASE}/archived-assignments`, { params }).then(res => res.data);
};
