/**
 * Archive Schedule Controller
 * 
 * Handles HTTP requests for automated archive scheduling including schedule CRUD,
 * manual archiving, archive logs, and scheduler status monitoring.
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as archiveScheduleDao from '../dao/archiveSchedule.dao';
import { ArchiveSchedule } from '../models/archiveSchedule.model';
import { getActiveScheduleCount } from '../services/archiveScheduler.service';

/**
 * Get all archive schedules
 * @route GET /api/archive-schedule/schedules
 */
export const getAllSchedules = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const schedules = await archiveScheduleDao.getAllSchedules();
    res.json(schedules);
  } catch (error) {
    console.error('[archiveSchedule.controller][getAllSchedules][Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get schedule by ID
 * @route GET /api/archive-schedule/schedules/:id
 */
export const getScheduleById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const schedules = await archiveScheduleDao.getScheduleById(id);

    if (!schedules || schedules.length === 0) {
      res.status(404).json({ message: 'Schedule not found' });
      return;
    }

    res.json(schedules[0]);
  } catch (error) {
    console.error('[archiveSchedule.controller][getScheduleById][Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Create new archive schedule
 * @route POST /api/archive-schedule/schedules
 */
export const createSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { schedule_time, shift, enabled } = req.body;

    const schedule: ArchiveSchedule = {
      schedule_time,
      shift,
      enabled: enabled ?? true,
      created_by: req.user?.id
    };

    const result = await archiveScheduleDao.createSchedule(schedule);
    const scheduleId = result.insertId;

    const [newSchedule] = await archiveScheduleDao.getScheduleById(scheduleId);

    res.status(201).json({
      message: 'Archive schedule created successfully',
      schedule: newSchedule
    });
  } catch (error) {
    console.error('[archiveSchedule.controller][createSchedule][Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update existing archive schedule
 * @route PUT /api/archive-schedule/schedules/:id
 */
export const updateSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { schedule_time, shift, enabled } = req.body;

    const schedule: ArchiveSchedule = {
      schedule_time,
      shift,
      enabled
    };

    const result = await archiveScheduleDao.updateSchedule(id, schedule);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Schedule not found' });
      return;
    }

    const [updatedSchedule] = await archiveScheduleDao.getScheduleById(id);

    res.json({
      message: 'Archive schedule updated successfully',
      schedule: updatedSchedule
    });
  } catch (error) {
    console.error('[archiveSchedule.controller][updateSchedule][Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete archive schedule
 * @route DELETE /api/archive-schedule/schedules/:id
 */
export const deleteSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const result = await archiveScheduleDao.deleteSchedule(id);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Schedule not found' });
      return;
    }

    res.json({ message: 'Archive schedule deleted successfully' });
  } catch (error) {
    console.error('[archiveSchedule.controller][deleteSchedule][Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Manual archive - archive assignments NOW for a specific shift
 * @route POST /api/archive-schedule/manual
 */
export const manualArchive = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shift } = req.body;

    if (!shift || !['1st', '2nd', '3rd'].includes(shift)) {
      res.status(400).json({ 
        success: false,
        message: 'Invalid shift. Must be 1st, 2nd, or 3rd' 
      });
      return;
    }

    // Get all assignments for this shift that haven't been archived
    const assignmentsToArchive = await archiveScheduleDao.getAssignmentsToArchive(shift);

    if (assignmentsToArchive.length === 0) {
      res.json({
        success: true,
        message: `No assignments found to archive for ${shift} shift`,
        assignments_archived: 0,
        shift
      });
      return;
    }

    const archiveDate = new Date();

    // Archive each assignment
    for (const assignment of assignmentsToArchive) {
      // Copy to archived_assignments
      await archiveScheduleDao.archiveAssignment(assignment, false); // false = manual archive

      // Mark as archived in assignments table
      await archiveScheduleDao.markAssignmentArchived(assignment.assignment_id);
    }

    // Create archive log
    const logResult = await archiveScheduleDao.createArchiveLog({
      archive_type: 'MANUAL',
      shift,
      assignments_archived: assignmentsToArchive.length,
      archive_date: archiveDate,
      triggered_by: req.user?.id
    });

    res.json({
      success: true,
      message: `Successfully archived ${assignmentsToArchive.length} assignment(s) for ${shift} shift`,
      assignments_archived: assignmentsToArchive.length,
      shift,
      archive_date: archiveDate,
      log_id: logResult.insertId
    });
  } catch (error) {
    console.error('[archiveSchedule.controller][manualArchive][Error]', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to archive assignments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get archive execution logs
 * @route GET /api/archive-schedule/logs
 */
export const getArchiveLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const logs = await archiveScheduleDao.getArchiveLogs();
    res.json(logs);
  } catch (error) {
    console.error('[archiveSchedule.controller][getArchiveLogs][Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get archived assignments with optional date filtering
 * @route GET /api/archive-schedule/archived-assignments
 */
export const getArchivedAssignments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { start_date, end_date } = req.query;

    let archived;
    if (start_date && end_date) {
      archived = await archiveScheduleDao.getArchivedAssignmentsByDateRange(
        start_date as string,
        end_date as string
      );
    } else {
      archived = await archiveScheduleDao.getArchivedAssignments();
    }

    res.json(archived);
  } catch (error) {
    console.error('[archiveSchedule.controller][getArchivedAssignments][Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get scheduler status - for diagnostics and monitoring
 * @route GET /api/archive-schedule/status
 */
export const getSchedulerStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const timezone = process.env.TZ || 'America/Phoenix';
    const currentTime = new Date().toLocaleString('en-US', { timeZone: timezone, hour12: false });
    const activeJobCount = getActiveScheduleCount();
    const enabledSchedules = await archiveScheduleDao.getEnabledSchedules();

    res.json({
      status: 'running',
      timezone,
      currentTime,
      serverTime: new Date().toISOString(),
      activeJobCount,
      enabledScheduleCount: enabledSchedules.length,
      schedules: enabledSchedules.map(s => ({
        id: s.id,
        shift: s.shift,
        scheduleTime: s.schedule_time,
        enabled: s.enabled,
        nextRun: `Today at ${s.schedule_time} ${timezone}`
      })),
      message: activeJobCount > 0 
        ? `Scheduler is running with ${activeJobCount} active job(s)` 
        : 'Scheduler is running but no jobs are scheduled. Enable a schedule to start automatic archiving.'
    });
  } catch (error) {
    console.error('[archiveSchedule.controller][getSchedulerStatus][Error]', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to get scheduler status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
