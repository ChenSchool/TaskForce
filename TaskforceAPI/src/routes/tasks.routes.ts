/**
 * Tasks routes module.
 * Defines RESTful endpoints for maintenance task CRUD operations with authentication and validation.
 */
import { Router } from 'express';
import * as ctrl from '../controllers/tasks.controller';
import { taskValidation, idParamValidation } from '../validators/entities.validator';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /tasks - Fetch all tasks
router.get('/', ctrl.getAll);

// GET /tasks/:id - Fetch task by ID
router.get('/:id', validate(idParamValidation), ctrl.getById);

// POST /tasks - Create new task
router.post('/', validate(taskValidation), ctrl.create);

// PUT /tasks/:id - Update task
router.put('/:id', validate([...idParamValidation, ...taskValidation]), ctrl.update);

// DELETE /tasks/:id - Delete task
router.delete('/:id', validate(idParamValidation), ctrl.remove);

export default router;