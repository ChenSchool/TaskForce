import { Response } from 'express';
import * as DashboardDao from '../dao/dashboard.dao';
import { AuthRequest } from '../middleware/auth.middleware';

export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Fetch all dashboard statistics in parallel
    const [
      taskStatsByStatus,
      personnelByShift,
      totalAssignments,
      trainingCompletionRate,
      recentActivity,
      tasksByDate
    ] = await Promise.all([
      DashboardDao.getTaskStatsByStatus(),
      DashboardDao.getPersonnelByShift(),
      DashboardDao.getTotalAssignments(),
      DashboardDao.getTrainingCompletionRate(),
      DashboardDao.getRecentActivity(),
      DashboardDao.getTasksByDate()
    ]);

    // Calculate training completion percentage
    const trainingData = trainingCompletionRate[0] || { total: 0, completed: 0 };
    const trainingCompletion = trainingData.total > 0 
      ? Math.round((trainingData.completed / trainingData.total) * 100) 
      : 0;

    res.json({
      taskStatsByStatus,
      personnelByShift,
      totalAssignments: totalAssignments[0]?.count || 0,
      training: {
        total: trainingData.total,
        completed: trainingData.completed,
        completionRate: trainingCompletion
      },
      recentActivity,
      tasksByDate
    });
  } catch (error) {
    console.error('[dashboard.controller][getStats][Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
