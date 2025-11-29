/**
 * Dashboard data access object (DAO) module.
 * Provides database queries for dashboard statistics and metrics aggregation.
 */
import { execute } from '../services/mysql.connector';
import { dashboardQueries } from '../queries/dashboard.queries';

/** Fetch task count grouped by status. */
export const getTaskStatsByStatus = async () => {
  return execute<any[]>(dashboardQueries.getTaskStatsByStatus, []);
};

/** Fetch personnel count grouped by shift. */
export const getPersonnelByShift = async () => {
  return execute<any[]>(dashboardQueries.getPersonnelByShift, []);
};

/** Fetch total count of assignments. */
export const getTotalAssignments = async () => {
  return execute<any[]>(dashboardQueries.getTotalAssignments, []);
};

/** Fetch training completion rate statistics. */
export const getTrainingCompletionRate = async () => {
  return execute<any[]>(dashboardQueries.getTrainingCompletionRate, []);
};

/** Fetch recent activity logs. */
export const getRecentActivity = async () => {
  return execute<any[]>(dashboardQueries.getRecentActivity, []);
};

/** Fetch task count grouped by date. */
export const getTasksByDate = async () => {
  return execute<any[]>(dashboardQueries.getTasksByDate, []);
};
