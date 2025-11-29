/**
 * Personnel data access object (DAO) module.
 * Provides database operations for personnel record management.
 */
import { OkPacket } from 'mysql';
import { execute } from '../services/mysql.connector';
import { Personnel } from '../models/personnel.model';
import { personnelQueries } from '../queries/personnel.queries';

/** Fetch all personnel records. */
export const getAllPersonnel = async () => {
  return await execute<Personnel[]>(personnelQueries.getAll, []);
};

/** Fetch a personnel record by ID. */
export const getPersonnelById = async (id: number) => {
  return await execute<Personnel[]>(personnelQueries.getById, [id]);
};

/** Fetch all personnel for a specific shift. */
export const getPersonnelByShift = async (shift: string) => {
  return await execute<Personnel[]>(personnelQueries.getByShift, [shift]);
};

/** Create a new personnel record. */
export const createPersonnel = async (personnel: Personnel) => {
  return await execute<OkPacket>(personnelQueries.create, [
    personnel.name,
    personnel.specialty,
    personnel.role,
    personnel.shift,
  ]);
};

/** Update an existing personnel record. */
export const updatePersonnel = async (id: number, personnel: Personnel) => {
  return await execute<OkPacket>(personnelQueries.updatePersonnel, [
    personnel.name,
    personnel.specialty,
    personnel.role,
    personnel.shift,
    id,
  ]);
};

/** Delete a personnel record by ID. */
export const deletePersonnel = async (id: number) => {
  return await execute<OkPacket>(personnelQueries.deletePersonnel, [id]);
};

