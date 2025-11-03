import { OkPacket } from 'mysql';
import { execute } from '../services/mysql.connector';
import { Personnel } from '../models/personnel.model';
import { personnelQueries } from '../queries/personnel.queries';

export const getAllPersonnel = async () => {
  return await execute<Personnel[]>(personnelQueries.getAll, []);
};

export const getPersonnelById = async (id: number) => {
  return await execute<Personnel[]>(personnelQueries.getById, [id]);
};

export const getPersonnelByShift = async (shift: string) => {
  return await execute<Personnel[]>(personnelQueries.getByShift, [shift]);
};

export const createPersonnel = async (personnel: Personnel) => {
  return await execute<OkPacket>(personnelQueries.create, [
    personnel.name,
    personnel.specialty,
    personnel.role,
    personnel.shift,
  ]);
};

export const updatePersonnel = async (id: number, personnel: Personnel) => {
  return await execute<OkPacket>(personnelQueries.updatePersonnel, [
    personnel.name,
    personnel.specialty,
    personnel.role,
    personnel.shift,
    id,
  ]);
};

export const deletePersonnel = async (id: number) => {
  return await execute<OkPacket>(personnelQueries.deletePersonnel, [id]);
};

