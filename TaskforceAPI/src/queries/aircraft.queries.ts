/**
 * Aircraft SQL queries module.
 * Contains parameterized SQL queries for aircraft CRUD operations.
 */
export const aircraftQueries = {
    allAircraft: 'SELECT * FROM aircraft',
    aircraftById: 'SELECT * FROM aircraft WHERE id = ?',
    insertAircraft: 'INSERT INTO aircraft (tail_number) VALUES (?)',
    updateAircraft: 'UPDATE aircraft SET tail_number=? WHERE id=?',
    deleteAircraft: 'DELETE FROM aircraft WHERE id=?',
};