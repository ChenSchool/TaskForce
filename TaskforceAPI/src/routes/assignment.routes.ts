import { Router } from 'express';
import * as ctrl from '../controllers/assignments.controller';
import { assignmentValidation, idParamValidation } from '../validators/entities.validator';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', ctrl.getAll);
router.get('/task/:taskId', ctrl.getByTaskId);  // Get all assignments for a specific task
router.get('/personnel/:personnelId', ctrl.getByPersonnelId);  // Get all assignments for a specific personnel
router.delete('/personnel/:personnelId', ctrl.deleteByPersonnelId);  // Delete all assignments for a specific personnel
router.get('/:id', validate(idParamValidation), ctrl.getById);
router.post('/', validate(assignmentValidation), ctrl.create);
router.put('/:id', validate([...idParamValidation, ...assignmentValidation]), ctrl.update);
router.delete('/:id', validate(idParamValidation), ctrl.remove);
export default router;