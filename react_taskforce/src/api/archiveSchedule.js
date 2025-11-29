/**
 * Archive Schedule API service
 * Manages automated archiving schedules and manual archive operations
 */
import api from '../dataSource';

const BASE = '/archive-schedules';

// === Schedule Management ===

// Fetch all archive schedules
export const getAllSchedules = () => api.get(`${BASE}/schedules`).then(res => res.data);

// Fetch single schedule by ID
export const getScheduleById = id => api.get(`${BASE}/schedules/${id}`).then(res => res.data);

// Create new archive schedule
export const createSchedule = data => api.post(`${BASE}/schedules`, data).then(res => res.data);

// Update existing schedule
export const updateSchedule = (id, data) => api.put(`${BASE}/schedules/${id}`, data).then(res => res.data);

// Delete archive schedule
export const deleteSchedule = id => api.delete(`${BASE}/schedules/${id}`);

// === Manual Archive Operations ===

// Trigger manual archive for specific shift
export const manualArchive = data => api.post(`${BASE}/manual`, data).then(res => res.data);

// === Archive History ===

// Fetch archive execution logs
export const getArchiveLogs = () => api.get(`${BASE}/logs`).then(res => res.data);

// Fetch archived assignments with optional date range filter
export const getArchivedAssignments = (startDate, endDate) => {
  const params = {};
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;
  return api.get(`${BASE}/archived-assignments`, { params }).then(res => res.data);
};
