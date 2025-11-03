export const dashboardQueries = {
  getTaskStatsByStatus: `
    SELECT status, COUNT(*) as count
    FROM tasks
    GROUP BY status
  `,
  
  getPersonnelByShift: `
    SELECT shift, COUNT(*) as count
    FROM personnel
    GROUP BY shift
  `,
  
  getTotalAssignments: `
    SELECT COUNT(*) as count
    FROM assignments
  `,
  
  getTrainingCompletionRate: `
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN complete = 1 THEN 1 ELSE 0 END) as completed
    FROM training
  `,
  
  getRecentActivity: `
    SELECT 
      al.action,
      al.entity_type,
      al.entity_id,
      al.created_at,
      u.username
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    ORDER BY al.created_at DESC
    LIMIT 10
  `,
  
  getTasksByDate: `
    SELECT DATE(date) as date, COUNT(*) as count
    FROM tasks
    WHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY DATE(date)
    ORDER BY date
  `
};
