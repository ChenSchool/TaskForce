import { OkPacket } from 'mysql';
import { execute } from '../services/mysql.connector';
import { Archive } from '../models/archives.model';
import { archiveQueries } from '../queries/archives.queries';

export const getAllArchives = async () => {
  return await execute<Archive[]>(archiveQueries.getAllArchives, []);
};

export const getArchiveById = async (id: number) => {
  return await execute<Archive[]>(archiveQueries.getArchiveById, [id]);
};

export const createArchive = async (archive: Archive) => {
  const now = new Date();
  const snapshot_date = archive.snapshot_date || now.toISOString().split('T')[0];
  const snapshot_time = archive.snapshot_time || now.toTimeString().split(' ')[0];
  
  return await execute<OkPacket>(archiveQueries.createArchive, [
    snapshot_date,
    snapshot_time,
    archive.shift || null,
    archive.aircraft_tail || null,
    JSON.stringify(archive.data_json) || null
  ]);
};

export const deleteArchive = async (id: number) => {
  return await execute<OkPacket>(archiveQueries.deleteArchive, [id]);
};

// Get data for archiving
export const getCompletedTasksForArchive = async (cutoffDate: string, shift: string) => {
  return await execute<any[]>(archiveQueries.getCompletedTasksForArchive, [cutoffDate, shift]);
};

export const getAssignmentsForArchive = async (cutoffDate: string, shift: string) => {
  return await execute<any[]>(archiveQueries.getAssignmentsForArchive, [cutoffDate, shift]);
};

export const getCompletedTrainingForArchive = async (shift: string) => {
  return await execute<any[]>(archiveQueries.getCompletedTrainingForArchive, [shift]);
};
