/**
 * Users routes module.
 * Defines endpoints for user management with role-based authorization, audit logging, and validation.
 */
import { Router } from 'express';
import * as usersController from '../controllers/users.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { auditLog } from '../middleware/auditLog.middleware';
import { registerValidation, updateUserValidation, changePasswordValidation } from '../validators/auth.validator';
import { idParamValidation } from '../validators/entities.validator';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// POST /users - Create new user (Manager/Supervisor only)
router.post('/', authorize('Manager', 'Supervisor'), validate(registerValidation), auditLog('CREATE', 'user'), usersController.createUser);

// GET /users - Fetch all users (Manager/Supervisor only)
router.get('/', authorize('Manager', 'Supervisor'), usersController.getAll);

// GET /users/:id - Fetch user by ID (own profile or Manager role)
router.get('/:id', validate(idParamValidation), usersController.getById);

// PUT /users/:id - Update user profile (own profile or Manager role)
router.put('/:id', validate([...idParamValidation, ...updateUserValidation]), auditLog('UPDATE', 'user'), usersController.update);

// PUT /users/:id/password - Change password
router.put('/:id/password', validate([...idParamValidation, ...changePasswordValidation]), auditLog('CHANGE_PASSWORD', 'user'), usersController.changePassword);

// PUT /users/:id/dark-mode - Update dark mode preference
router.put('/:id/dark-mode', validate(idParamValidation), usersController.updateDarkMode);

// DELETE /users/:id - Delete user (Manager/Supervisor only)
router.delete('/:id', authorize('Manager', 'Supervisor'), validate(idParamValidation), auditLog('DELETE', 'user'), usersController.deactivate);

export default router;
