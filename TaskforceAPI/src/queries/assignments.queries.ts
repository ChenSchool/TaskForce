// src/queries/assignments.queries.ts

export const assignmentQueries = {
  
  getAllAssignments: `
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
  `,
}; // Delete an assignment by its ID
