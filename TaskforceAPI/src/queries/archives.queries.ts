// Archives queries
export const archiveQueries = {
  
  getAllArchives: `
    SELECT *
    FROM archive
    ORDER BY snapshot_date DESC, snapshot_time DESC
  `,

  getArchiveById: `
    SELECT *
    FROM archive
    WHERE id = ?
  `,

  createArchive: `
    INSERT INTO archive (
      snapshot_date,
      snapshot_time,
      shift,
      aircraft_tail,
      data_json
    )
    VALUES (?, ?, ?, ?, ?)
  `,

  deleteArchive: `
    DELETE FROM archive
    WHERE id = ?
  `,

  // Queries to get data for archiving
  getCompletedTasksForArchive: `
    SELECT 
      t.*,
      ac.tail_number as aircraft_tail
    FROM tasks t
    JOIN aircraft ac ON t.aircraft_id = ac.id
    WHERE t.status = 'Complete'
    AND t.date < ?
    AND t.shift = ?
  `,

  getAssignmentsForArchive: `
    SELECT 
      a.*,
      t.description as task_description,
      p.name as personnel_name,
      ac.tail_number as aircraft_tail
    FROM assignments a
    JOIN tasks t ON a.task_id = t.id
    JOIN personnel p ON a.personnel_id = p.id
    JOIN aircraft ac ON t.aircraft_id = ac.id
    WHERE t.status = 'Complete'
    AND t.date < ?
    AND t.shift = ?
  `,

  getCompletedTrainingForArchive: `
    SELECT 
      t.*,
      p.name as personnel_name
    FROM training t
    JOIN personnel p ON t.personnel_id = p.id
    WHERE t.complete = 1
    AND p.shift = ?
  `
};
