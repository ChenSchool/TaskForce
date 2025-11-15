import { OkPacket } from 'mysql';
import { execute } from '../services/mysql.connector';
import { archiveScheduleQueries } from '../queries/archiveSchedule.queries';
import { ArchiveSchedule, ArchivedAssignment, ArchiveLog } from '../models/archiveSchedule.model';

// Archive Schedule Management
export const getAllSchedules = async () => {
  return await execute<ArchiveSchedule[]>(archiveScheduleQueries.getAllSchedules, []);
};

export const getEnabledSchedules = async () => {
  return await execute<ArchiveSchedule[]>(archiveScheduleQueries.getEnabledSchedules, []);
};

export const getScheduleById = async (id: number) => {
  return await execute<ArchiveSchedule[]>(archiveScheduleQueries.getScheduleById, [id]);
};

export const createSchedule = async (schedule: ArchiveSchedule) => {
  return await execute<OkPacket>(archiveScheduleQueries.createSchedule, [
    schedule.schedule_time,
    schedule.shift,
    schedule.enabled,
    schedule.created_by
  ]);
};

export const updateSchedule = async (id: number, schedule: ArchiveSchedule) => {
  return await execute<OkPacket>(archiveScheduleQueries.updateSchedule, [
    schedule.schedule_time,
    schedule.shift,
    schedule.enabled,
    id
  ]);
};

export const deleteSchedule = async (id: number) => {
  return await execute<OkPacket>(archiveScheduleQueries.deleteSchedule, [id]);
};

// Archive Operations
export const getAssignmentsToArchive = async (shift: string) => {
  return await execute<any[]>(archiveScheduleQueries.getAssignmentsToArchive, [shift]);
};

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

export const markAssignmentArchived = async (assignmentId: number) => {
  return await execute<OkPacket>(archiveScheduleQueries.markAssignmentArchived, [assignmentId]);
};

export const deleteArchivedAssignments = async (assignmentId: number) => {
  return await execute<OkPacket>(archiveScheduleQueries.deleteArchivedAssignments, [assignmentId]);
};

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

export const getArchiveLogs = async () => {
  return await execute<ArchiveLog[]>(archiveScheduleQueries.getArchiveLogs, []);
};

export const getArchivedAssignments = async () => {
  return await execute<ArchivedAssignment[]>(archiveScheduleQueries.getArchivedAssignments, []);
};

export const getArchivedAssignmentsByDateRange = async (startDate: string, endDate: string) => {
  return await execute<ArchivedAssignment[]>(archiveScheduleQueries.getArchivedAssignmentsByDateRange, [startDate, endDate]);
};

// Delete archived assignments older than specified date
export const deleteOldArchivedAssignments = async (cutoffDate: Date) => {
  return await execute<OkPacket>(archiveScheduleQueries.deleteOldArchivedAssignments, [cutoffDate]);
};
