/**
 * Authentication Routes
 * 
 * Defines REST API endpoints for user authentication including login, logout,
 * token refresh, and current user retrieval with validation middleware.
 */

import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { loginValidation } from '../validators/auth.validator';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// Public routes
router.post('/login', validate(loginValidation), authController.login);
router.post('/refresh', authController.refreshToken);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
