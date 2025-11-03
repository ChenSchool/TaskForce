import { execute } from '../services/mysql.connector';
import { dashboardQueries } from '../queries/dashboard.queries';

export const getTaskStatsByStatus = async () => {
  return execute<any[]>(dashboardQueries.getTaskStatsByStatus, []);
};

export const getPersonnelByShift = async () => {
  return execute<any[]>(dashboardQueries.getPersonnelByShift, []);
};

export const getTotalAssignments = async () => {
  return execute<any[]>(dashboardQueries.getTotalAssignments, []);
};

export const getTrainingCompletionRate = async () => {
  return execute<any[]>(dashboardQueries.getTrainingCompletionRate, []);
};

export const getRecentActivity = async () => {
  return execute<any[]>(dashboardQueries.getRecentActivity, []);
};

export const getTasksByDate = async () => {
  return execute<any[]>(dashboardQueries.getTasksByDate, []);
};
