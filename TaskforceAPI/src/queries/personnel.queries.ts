/**
 * Personnel SQL queries module.
 * Contains parameterized SQL queries for personnel CRUD operations including shift-based filtering.
 */
export const personnelQueries = {
  getAll: 'SELECT * FROM personnel',
  getById: 'SELECT * FROM personnel WHERE id = ?',
  getByShift: 'SELECT * FROM personnel WHERE shift = ?',
  create: 'INSERT INTO personnel (name, specialty, role, shift) VALUES (?, ?, ?, ?)',
  updatePersonnel: 'UPDATE personnel SET name = ?, specialty = ?, role = ?, shift = ? WHERE id = ?',
  deletePersonnel: 'DELETE FROM personnel WHERE id = ?',
};