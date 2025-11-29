/**
 * Task SQL queries module.
 * Contains parameterized SQL queries for maintenance task CRUD operations.
 */
export const taskQueries = {
    // Fetch all tasks
    getAllTasks: `
      SELECT 
        id,
        aircraft_id,
        shift,
        description,
        status,
        date
      FROM tasks
    `,

    // Fetch a single task by its PK
    getTasksById: `
      SELECT 
        id,
        aircraft_id,
        shift,
        description,
        status,
        date
      FROM tasks
      WHERE id = ?
    `,

    // (Optional) Fetch all tasks for a given aircraft
    getTaskByAircraftId: `
      SELECT 
        id,
        aircraft_id,
        shift,
        description,
        status,
        date
      FROM tasks
      WHERE aircraft_id = ?
    `,

    // Insert a new task
    createTask: `
      INSERT INTO tasks 
        (aircraft_id, shift, description, status, date)
      VALUES 
        (?,          ?,     ?,           ?,      ?)
    `,

    // Update an existing task
    updateTask: `
      UPDATE tasks SET
        aircraft_id = ?,
        shift       = ?,
        description = ?,
        status      = ?,
        date        = ?
      WHERE id = ?
    `,

    // Delete a task
    removeTask: `
      DELETE FROM tasks
      WHERE id = ?
    `
};
