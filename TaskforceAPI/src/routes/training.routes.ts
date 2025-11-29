/**
 * Training routes module.
 * Defines RESTful endpoints for training record CRUD operations and statistics with authentication.
 */
import { Router } from 'express';
import * as ctrl from '../controllers/training.controller';
import { trainingValidation, idParamValidation } from '../validators/entities.validator';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /training - Fetch all training records
router.get('/', ctrl.getAll);

// GET /training/stats - Fetch training statistics
router.get('/stats', ctrl.getStats);

// GET /training/personnel/:personnelId - Fetch training by personnel ID
router.get('/personnel/:personnelId', ctrl.getByPersonnelId);

// GET /training/:id - Fetch training by ID
router.get('/:id', validate(idParamValidation), ctrl.getById);

// POST /training - Create new training record
router.post('/', validate(trainingValidation), ctrl.create);

// PUT /training/:id - Update training record
router.put('/:id', validate([...idParamValidation, ...trainingValidation]), ctrl.update);

// DELETE /training/:id - Delete training record
router.delete('/:id', validate(idParamValidation), ctrl.remove);

export default router;
