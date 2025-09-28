
export const personnelQueries = {
  getAll: 'SELECT * FROM personnel',
  getById: 'SELECT * FROM personnel WHERE id = ?',
  create: 'INSERT INTO personnel (name, specialty, role) VALUES (?, ?, ?)',
  updatePersonnel: 'UPDATE personnel SET name = ?, specialty = ?, role = ? WHERE id = ?',
  deletePersonnel: 'DELETE FROM personnel WHERE id = ?',
};