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

// Only managers and supervisors can create users
router.post('/', authorize('Manager', 'Supervisor'), validate(registerValidation), auditLog('CREATE', 'user'), usersController.createUser);

// Only managers and supervisors can view all users
router.get('/', authorize('Manager', 'Supervisor'), usersController.getAll);

// Users can view their own profile, managers can view any
router.get('/:id', validate(idParamValidation), usersController.getById);

// Users can update their own profile, managers can update any
router.put('/:id', validate([...idParamValidation, ...updateUserValidation]), auditLog('UPDATE', 'user'), usersController.update);

// Change password
router.put('/:id/password', validate([...idParamValidation, ...changePasswordValidation]), auditLog('CHANGE_PASSWORD', 'user'), usersController.changePassword);

// Update dark mode preference
router.put('/:id/dark-mode', validate(idParamValidation), usersController.updateDarkMode);

// Only managers and supervisors can delete users
router.delete('/:id', authorize('Manager', 'Supervisor'), validate(idParamValidation), auditLog('DELETE', 'user'), usersController.deactivate);

export default router;
