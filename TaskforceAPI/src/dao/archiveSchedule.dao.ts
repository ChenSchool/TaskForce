/**
 * Archive Schedule data access object (DAO) module.
 * Provides database operations for automated archive scheduling, execution, logging, and archived data management.
 */
import { OkPacket } from 'mysql';
import { execute } from '../services/mysql.connector';
import { archiveScheduleQueries } from '../queries/archiveSchedule.queries';
import { ArchiveSchedule, ArchivedAssignment, ArchiveLog } from '../models/archiveSchedule.model';

// Archive Schedule Management

/** Fetch all archive schedules. */
export const getAllSchedules = async () => {
  return await execute<ArchiveSchedule[]>(archiveScheduleQueries.getAllSchedules, []);
};

/** Fetch only enabled archive schedules. */
export const getEnabledSchedules = async () => {
  return await execute<ArchiveSchedule[]>(archiveScheduleQueries.getEnabledSchedules, []);
};

/** Fetch an archive schedule by ID. */
export const getScheduleById = async (id: number) => {
  return await execute<ArchiveSchedule[]>(archiveScheduleQueries.getScheduleById, [id]);
};

/** Create a new archive schedule. */
export const createSchedule = async (schedule: ArchiveSchedule) => {
  return await execute<OkPacket>(archiveScheduleQueries.createSchedule, [
    schedule.schedule_time,
    schedule.shift,
    schedule.enabled,
    schedule.created_by
  ]);
};

/** Update an existing archive schedule. */
export const updateSchedule = async (id: number, schedule: ArchiveSchedule) => {
  return await execute<OkPacket>(archiveScheduleQueries.updateSchedule, [
    schedule.schedule_time,
    schedule.shift,
    schedule.enabled,
    id
  ]);
};

/** Delete an archive schedule by ID. */
export const deleteSchedule = async (id: number) => {
  return await execute<OkPacket>(archiveScheduleQueries.deleteSchedule, [id]);
};

// Archive Operations

/** Fetch assignments ready to be archived for a specific shift. */
export const getAssignmentsToArchive = async (shift: string) => {
  return await execute<any[]>(archiveScheduleQueries.getAssignmentsToArchive, [shift]);
};

/** Archive an assignment with full task and personnel details. */
export const archiveAssignment = async (assignment: any, archivedBySchedule: boolean) => {
  return await execute<OkPacket>(archiveScheduleQueries.archiveAssignment, [
    assignment.assignment_id,
    assignment.task_id,
    assignment.personnel_id,
    assignment.personnel_name,
    assignment.role,
    assignment.task_description,
    assignment.task_status,
    assignment.task_date,
    assignment.task_shift,
    assignment.aircraft_tail,
    archivedBySchedule
  ]);
};

/** Mark an assignment as archived in the assignments table. */
export const markAssignmentArchived = async (assignmentId: number) => {
  return await execute<OkPacket>(archiveScheduleQueries.markAssignmentArchived, [assignmentId]);
};

/** Delete archived assignment records by assignment ID. */
export const deleteArchivedAssignments = async (assignmentId: number) => {
  return await execute<OkPacket>(archiveScheduleQueries.deleteArchivedAssignments, [assignmentId]);
};

/** Create an archive execution log entry. */
export const createArchiveLog = async (log: ArchiveLog) => {
  return await execute<OkPacket>(archiveScheduleQueries.createArchiveLog, [
    log.archive_type,
    log.shift,
    log.assignments_archived,
    log.archive_date,
    log.triggered_by || null,
    log.schedule_id || null
  ]);
};

/** Fetch all archive execution logs. */
export const getArchiveLogs = async () => {
  return await execute<ArchiveLog[]>(archiveScheduleQueries.getArchiveLogs, []);
};

/** Fetch all archived assignments. */
export const getArchivedAssignments = async () => {
  return await execute<ArchivedAssignment[]>(archiveScheduleQueries.getArchivedAssignments, []);
};

/** Fetch archived assignments within a specific date range. */
export const getArchivedAssignmentsByDateRange = async (startDate: string, endDate: string) => {
  return await execute<ArchivedAssignment[]>(archiveScheduleQueries.getArchivedAssignmentsByDateRange, [startDate, endDate]);
};

/** Delete archived assignments older than the specified cutoff date. */
export const deleteOldArchivedAssignments = async (cutoffDate: Date) => {
  return await execute<OkPacket>(archiveScheduleQueries.deleteOldArchivedAssignments, [cutoffDate]);
};
