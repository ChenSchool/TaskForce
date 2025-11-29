/**
 * Dashboard routes module.
 * Defines endpoints for retrieving dashboard statistics and metrics with authentication.
 */
import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /dashboard/stats - Fetch dashboard statistics
router.get('/stats', dashboardController.getStats);

export default router;
