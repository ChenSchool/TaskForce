/**
 * Training SQL queries module.
 * Contains parameterized SQL queries for training record management with personnel joins and statistics.
 */
export const trainingQueries = {
  
  getAllTraining: `
    SELECT 
      t.*,
      p.name AS personnel_name,
      p.specialty AS personnel_specialty,
      p.role AS personnel_role
    FROM training t
    JOIN personnel p ON t.personnel_id = p.id
    ORDER BY t.id DESC
  `,

  getTrainingById: `
    SELECT 
      t.*,
      p.name AS personnel_name,
      p.specialty AS personnel_specialty,
      p.role AS personnel_role
    FROM training t
    JOIN personnel p ON t.personnel_id = p.id
    WHERE t.id = ?
  `,

  getTrainingByPersonnelId: `
    SELECT 
      t.*,
      p.name AS personnel_name,
      p.specialty AS personnel_specialty,
      p.role AS personnel_role
    FROM training t
    JOIN personnel p ON t.personnel_id = p.id
    WHERE t.personnel_id = ?
    ORDER BY t.id DESC
  `,

  createTraining: `
    INSERT INTO training (
      personnel_id, 
      phase, 
      progress, 
      complete
    )
    VALUES (?, ?, ?, ?)
  `,

  updateTraining: `
    UPDATE training
    SET 
      personnel_id = ?,
      phase = ?,
      progress = ?,
      complete = ?
    WHERE id = ?
  `,

  deleteTraining: `
    DELETE FROM training
    WHERE id = ?
  `,

  getTrainingStats: `
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN complete = 1 THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN complete = 0 THEN 1 ELSE 0 END) as incomplete,
      AVG(progress) as avg_progress
    FROM training
  `
};
