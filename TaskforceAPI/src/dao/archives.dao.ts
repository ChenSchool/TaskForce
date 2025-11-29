/**
 * Archives data access object (DAO) module.
 * Provides database operations for archive management including data snapshots and retrieval of archivable records.
 */
import { OkPacket } from 'mysql';
import { execute } from '../services/mysql.connector';
import { Archive } from '../models/archives.model';
import { archiveQueries } from '../queries/archives.queries';

/** Fetch all archive snapshots. */
export const getAllArchives = async () => {
  return await execute<Archive[]>(archiveQueries.getAllArchives, []);
};

/** Fetch an archive snapshot by ID. */
export const getArchiveById = async (id: number) => {
  return await execute<Archive[]>(archiveQueries.getArchiveById, [id]);
};

/** Create a new archive snapshot with timestamp and data. */
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

/** Delete an archive snapshot by ID. */
export const deleteArchive = async (id: number) => {
  return await execute<OkPacket>(archiveQueries.deleteArchive, [id]);
};

// Data retrieval for archiving

/** Fetch completed tasks eligible for archiving based on cutoff date and shift. */
export const getCompletedTasksForArchive = async (cutoffDate: string, shift: string) => {
  return await execute<any[]>(archiveQueries.getCompletedTasksForArchive, [cutoffDate, shift]);
};

/** Fetch assignments eligible for archiving based on cutoff date and shift. */
export const getAssignmentsForArchive = async (cutoffDate: string, shift: string) => {
  return await execute<any[]>(archiveQueries.getAssignmentsForArchive, [cutoffDate, shift]);
};

/** Fetch completed training records eligible for archiving by shift. */
export const getCompletedTrainingForArchive = async (shift: string) => {
  return await execute<any[]>(archiveQueries.getCompletedTrainingForArchive, [shift]);
};
