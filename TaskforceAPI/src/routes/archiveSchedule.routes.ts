import { Router } from 'express';
import * as ctrl from '../controllers/archiveSchedule.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { archiveScheduleValidation, manualArchiveValidation, idParamValidation } from '../validators/entities.validator';
import { validate } from '../middleware/validation.middleware';
import { auditLog } from '../middleware/auditLog.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Schedule management - Manager and Supervisor only
router.get('/schedules', authorize('Manager', 'Supervisor'), ctrl.getAllSchedules);
router.get('/schedules/:id', authorize('Manager', 'Supervisor'), validate(idParamValidation), ctrl.getScheduleById);
router.post('/schedules', authorize('Manager', 'Supervisor'), validate(archiveScheduleValidation), auditLog('CREATE', 'archive_schedule'), ctrl.createSchedule);
router.put('/schedules/:id', authorize('Manager', 'Supervisor'), validate([...idParamValidation, ...archiveScheduleValidation]), auditLog('UPDATE', 'archive_schedule'), ctrl.updateSchedule);
router.delete('/schedules/:id', authorize('Manager', 'Supervisor'), validate(idParamValidation), auditLog('DELETE', 'archive_schedule'), ctrl.deleteSchedule);

// Manual archive - Manager and Supervisor only
router.post('/manual', authorize('Manager', 'Supervisor'), validate(manualArchiveValidation), auditLog('ARCHIVE', 'assignments'), ctrl.manualArchive);

// View archive logs - Manager and Supervisor only
router.get('/logs', authorize('Manager', 'Supervisor'), ctrl.getArchiveLogs);

// View archived assignments - All authenticated users
router.get('/archived-assignments', ctrl.getArchivedAssignments);

export default router;
