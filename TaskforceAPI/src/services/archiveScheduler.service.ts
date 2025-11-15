import cron, { ScheduledTask } from 'node-cron';
import * as archiveScheduleDao from '../dao/archiveSchedule.dao';

let scheduledJobs: Map<number, ScheduledTask> = new Map();

/**
 * Convert database time (HH:MM:SS) to cron expression
 * Example: "14:30:00" => "30 14 * * *" (runs at 2:30 PM every day)
 */
const timeToCronExpression = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  return `${minutes} ${hours} * * *`; // minute hour * * * (daily)
};

/**
 * Execute archive operation for a schedule
 */
const executeArchive = async (scheduleId: number, shift: string) => {
  try {
    console.log(`[Archive Job ${scheduleId}] Starting scheduled archive for ${shift} shift...`);

    // Get all assignments for this shift that haven't been archived
    const assignmentsToArchive = await archiveScheduleDao.getAssignmentsToArchive(shift);

    console.log(`[Archive Job ${scheduleId}] Found ${assignmentsToArchive.length} assignments to archive for ${shift} shift`);

    if (assignmentsToArchive.length === 0) {
      console.log(`[Archive Job ${scheduleId}] No assignments to archive for ${shift} shift`);
      return;
    }

    const archiveDate = new Date();

    // Archive each assignment
    for (const assignment of assignmentsToArchive) {
      // Copy to archived_assignments
      await archiveScheduleDao.archiveAssignment(assignment, true); // true = scheduled archive

      // Mark as archived in assignments table
      await archiveScheduleDao.markAssignmentArchived(assignment.assignment_id);
    }

    // Create archive log
    await archiveScheduleDao.createArchiveLog({
      archive_type: 'SCHEDULED',
      shift,
      assignments_archived: assignmentsToArchive.length,
      archive_date: archiveDate,
      schedule_id: scheduleId
    });

    console.log(`[Archive Job ${scheduleId}] Successfully archived ${assignmentsToArchive.length} assignments for ${shift} shift`);
  } catch (error) {
    console.error(`[Archive Job ${scheduleId}] Error during scheduled archive:`, error);
  }
};

/**
 * Execute cleanup of old archived assignments (older than 2 years)
 */
const executeCleanup = async () => {
  try {
    console.log('[Archive Cleanup] Starting cleanup of old archived assignments...');

    // Calculate cutoff date (2 years ago)
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - 2);

    console.log(`[Archive Cleanup] Deleting archived assignments older than ${cutoffDate.toISOString()}`);

    // Delete old archived assignments
    const result = await archiveScheduleDao.deleteOldArchivedAssignments(cutoffDate);

    console.log(`[Archive Cleanup] Deleted ${result.affectedRows || 0} old archived assignment(s)`);
  } catch (error) {
    console.error('[Archive Cleanup] Error during cleanup:', error);
  }
};

/**
 * Initialize cleanup job to run daily at 3 AM
 */
const initializeCleanupJob = () => {
  // Run daily at 3:00 AM
  const cleanupTask = cron.schedule('0 3 * * *', () => {
    executeCleanup();
  });

  console.log('[Archive Cleanup] Initialized daily cleanup job (runs at 3:00 AM)');

  return cleanupTask;
};

/**
 * Initialize and start all enabled archive schedules
 */
export const initializeArchiveSchedules = async () => {
  try {
    console.log('[Archive Scheduler] Initializing archive schedules...');

    // Stop all existing scheduled jobs
    stopAllSchedules();

    // Initialize the cleanup job for old archives (2 year retention)
    initializeCleanupJob();

    // Get all enabled schedules from database
    const schedules = await archiveScheduleDao.getEnabledSchedules();

    if (schedules.length === 0) {
      console.log('[Archive Scheduler] No enabled schedules found');
      return;
    }

    // Schedule each job
    for (const schedule of schedules) {
      if (schedule.id) {
        scheduleJob(schedule.id, schedule.schedule_time, schedule.shift);
      }
    }

    console.log(`[Archive Scheduler] Initialized ${schedules.length} archive schedule(s)`);
  } catch (error) {
    console.error('[Archive Scheduler] Error initializing schedules:', error);
  }
};

/**
 * Schedule a single archive job
 */
export const scheduleJob = (scheduleId: number, scheduleTime: string, shift: string) => {
  try {
    // Stop existing job for this schedule if it exists
    stopSchedule(scheduleId);

    // Convert time to cron expression
    const cronExpression = timeToCronExpression(scheduleTime);

    // Validate cron expression
    if (!cron.validate(cronExpression)) {
      console.error(`[Archive Scheduler] Invalid cron expression: ${cronExpression}`);
      return;
    }

    // Create and start the scheduled task
    const task = cron.schedule(cronExpression, () => {
      executeArchive(scheduleId, shift);
    });

    // Store the task reference
    scheduledJobs.set(scheduleId, task);

    console.log(`[Archive Scheduler] Scheduled job ${scheduleId} for ${shift} shift at ${scheduleTime} (${cronExpression})`);
  } catch (error) {
    console.error(`[Archive Scheduler] Error scheduling job ${scheduleId}:`, error);
  }
};

/**
 * Stop a specific scheduled job
 */
export const stopSchedule = (scheduleId: number) => {
  const task = scheduledJobs.get(scheduleId);
  if (task) {
    task.stop();
    scheduledJobs.delete(scheduleId);
    console.log(`[Archive Scheduler] Stopped schedule ${scheduleId}`);
  }
};

/**
 * Stop all scheduled jobs
 */
export const stopAllSchedules = () => {
  scheduledJobs.forEach((task, scheduleId) => {
    task.stop();
    console.log(`[Archive Scheduler] Stopped schedule ${scheduleId}`);
  });
  scheduledJobs.clear();
};

/**
 * Reload all schedules (useful after database changes)
 */
export const reloadSchedules = async () => {
  console.log('[Archive Scheduler] Reloading schedules...');
  await initializeArchiveSchedules();
};

/**
 * Get currently active schedule count
 */
export const getActiveScheduleCount = (): number => {
  return scheduledJobs.size;
};
