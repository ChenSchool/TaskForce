/**
 * Assignments SQL queries module.
 * Contains parameterized SQL queries for assignment CRUD operations with multi-table joins for task, aircraft, and personnel details.
 */
export const assignmentQueries = {
  
  getAllAssignments: `
  SELECT
    a.id                  AS assignment_id,
    t.id                  AS task_id,
    ac.tail_number        AS aircraft_tail,
    t.description         AS task_description,
    t.status              AS task_status,
    t.shift               AS task_shift,
    p.name                AS personnel_name,
    a.role                AS assignment_role
  FROM assignments a
  JOIN tasks      t  ON a.task_id      = t.id
  JOIN aircraft   ac ON t.aircraft_id  = ac.id
  JOIN personnel  p  ON a.personnel_id = p.id
`, // Fetch all assignments with task and personnel details

getAssignmentById: `
  SELECT
    a.id                  AS assignment_id,
    t.id                  AS task_id,
    ac.tail_number        AS aircraft_tail,
    t.description         AS task_description,
    t.status              AS task_status,
    p.name                AS personnel_name,
    a.role                AS assignment_role
  FROM assignments a
  JOIN tasks      t  ON a.task_id      = t.id
  JOIN aircraft   ac ON t.aircraft_id  = ac.id
  JOIN personnel  p  ON a.personnel_id = p.id
  WHERE a.id = ?
`, // Fetch a single assignment by its PK with task and personnel details

  createAssignment: `
    INSERT INTO assignments (task_id, personnel_id, role)
    VALUES (?, ?, ?)
  `, // Insert a new assignment

  updateAssignment: `
    UPDATE assignments
    SET 
      task_id      = ?,
      personnel_id = ?,
      role         = ?
    WHERE id = ?
  `, // Update an existing assignment

  deleteAssignment: `
    DELETE FROM assignments
    WHERE id = ?
  `, // Delete an assignment by its ID

  getAssignmentsByTaskId: `
    SELECT
      a.id                  AS assignment_id,
      a.personnel_id        AS personnel_id,
      p.name                AS personnel_name,
      a.role                AS role
    FROM assignments a
    JOIN personnel  p  ON a.personnel_id = p.id
    WHERE a.task_id = ?
  `, // Fetch all assignments for a specific task

  deleteAssignmentsByTaskId: `
    DELETE FROM assignments
    WHERE task_id = ?
  `, // Delete all assignments for a specific task

  getAssignmentsByPersonnelId: `
    SELECT
      a.id                  AS assignment_id,
      a.task_id             AS task_id,
      t.description         AS task_description,
      a.role                AS role
    FROM assignments a
    JOIN tasks  t  ON a.task_id = t.id
    WHERE a.personnel_id = ?
  `, // Fetch all assignments for a specific personnel

  deleteAssignmentsByPersonnelId: `
    DELETE FROM assignments
    WHERE personnel_id = ?
  `, // Delete all assignments for a specific personnel
};
