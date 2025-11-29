/**
 * Archive Schedule SQL queries module.
 * Contains parameterized SQL queries for automated archive scheduling, execution, logging, and archived data management.
 */
export const archiveScheduleQueries = {
  // Get all schedules
  getAllSchedules: `
    SELECT 
      id,
      schedule_time,
      shift,
      enabled,
      created_at,
      updated_at,
      created_by
    FROM archive_schedules
    ORDER BY shift ASC, schedule_time ASC
  `,

  // Get enabled schedules only
  getEnabledSchedules: `
    SELECT 
      id,
      schedule_time,
      shift,
      enabled,
      created_at,
      updated_at,
      created_by
    FROM archive_schedules
    WHERE enabled = TRUE
    ORDER BY shift ASC, schedule_time ASC
  `,

  // Get schedule by ID
  getScheduleById: `
    SELECT 
      id,
      schedule_time,
      shift,
      enabled,
      created_at,
      updated_at,
      created_by
    FROM archive_schedules
    WHERE id = ?
  `,

  // Create new schedule
  createSchedule: `
    INSERT INTO archive_schedules (schedule_time, shift, enabled, created_by)
    VALUES (?, ?, ?, ?)
  `,

  // Update schedule
  updateSchedule: `
    UPDATE archive_schedules
    SET schedule_time = ?, shift = ?, enabled = ?
    WHERE id = ?
  `,

  // Delete schedule
  deleteSchedule: `
    DELETE FROM archive_schedules
    WHERE id = ?
  `,

  // Get assignments to archive by shift
  getAssignmentsToArchive: `
    SELECT 
      a.id AS assignment_id,
      a.task_id,
      a.personnel_id,
      p.name AS personnel_name,
      a.role,
      t.description AS task_description,
      t.status AS task_status,
      t.date AS task_date,
      t.shift AS task_shift,
      ac.tail_number AS aircraft_tail
    FROM assignments a
    INNER JOIN tasks t ON a.task_id = t.id
    INNER JOIN personnel p ON a.personnel_id = p.id
    INNER JOIN aircraft ac ON t.aircraft_id = ac.id
    WHERE t.shift = ?
      AND (a.archived IS NULL OR a.archived = FALSE)
    ORDER BY t.date ASC
  `,

  // Archive an assignment (copy to archived_assignments)
  archiveAssignment: `
    INSERT INTO archived_assignments 
      (original_assignment_id, task_id, personnel_id, personnel_name, role, 
       task_description, task_status, task_date, task_shift, aircraft_tail, archived_by_schedule)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  // Mark assignment as archived
  markAssignmentArchived: `
    UPDATE assignments
    SET archived = TRUE, archived_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `,

  // Delete archived assignments
  deleteArchivedAssignments: `
    DELETE FROM assignments
    WHERE id = ?
  `,

  // Create archive log entry
  createArchiveLog: `
    INSERT INTO archive_logs (archive_type, shift, assignments_archived, archive_date, triggered_by, schedule_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `,

  // Get archive logs
  getArchiveLogs: `
    SELECT 
      al.id,
      al.archive_type,
      al.shift,
      al.assignments_archived,
      al.archive_date,
      al.triggered_by,
      u.username AS triggered_by_username,
      al.schedule_id,
      al.created_at
    FROM archive_logs al
    LEFT JOIN users u ON al.triggered_by = u.id
    ORDER BY al.archive_date DESC
    LIMIT 100
  `,

  // Get archived assignments
  getArchivedAssignments: `
    SELECT 
      id,
      original_assignment_id,
      task_id,
      personnel_id,
      personnel_name,
      role,
      task_description,
      task_status,
      task_date,
      task_shift,
      aircraft_tail,
      archived_at,
      archived_by_schedule
    FROM archived_assignments
    ORDER BY archived_at DESC
    LIMIT 1000
  `,

  // Get archived assignments by date range
  getArchivedAssignmentsByDateRange: `
    SELECT 
      id,
      original_assignment_id,
      task_id,
      personnel_id,
      personnel_name,
      role,
      task_description,
      task_status,
      task_date,
      task_shift,
      aircraft_tail,
      archived_at,
      archived_by_schedule
    FROM archived_assignments
    WHERE task_date BETWEEN ? AND ?
    ORDER BY archived_at DESC
  `,

  // Delete archived assignments older than cutoff date (2 years)
  deleteOldArchivedAssignments: `
    DELETE FROM archived_assignments
    WHERE archived_at < ?
  `
};
