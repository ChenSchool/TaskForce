import { Router } from 'express';
import * as auditLogsController from '../controllers/auditLogs.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Only managers and supervisors can view audit logs
router.use(authenticate, authorize('Manager', 'Supervisor'));

router.get('/', auditLogsController.getAll);
router.get('/user/:userId', auditLogsController.getByUser);
router.get('/entity/:entityType/:entityId', auditLogsController.getByEntity);

export default router;
