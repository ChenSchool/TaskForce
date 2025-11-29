/**
 * Personnel routes module.
 * Defines RESTful endpoints for personnel CRUD operations with authentication and validation.
 */
import { Router } from 'express';
import * as ctrl from '../controllers/personnel.controller';
import { personnelValidation, idParamValidation } from '../validators/entities.validator';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /personnel - Fetch all personnel
router.get('/', ctrl.getAll);

// GET /personnel/shift/:shift - Fetch personnel by shift
router.get('/shift/:shift', ctrl.getByShift);

// GET /personnel/:id - Fetch personnel by ID
router.get('/:id', validate(idParamValidation), ctrl.getById);

// POST /personnel - Create new personnel
router.post('/', validate(personnelValidation), ctrl.create);

// PUT /personnel/:id - Update personnel
router.put('/:id', validate([...idParamValidation, ...personnelValidation]), ctrl.update);

// DELETE /personnel/:id - Delete personnel
router.delete('/:id', validate(idParamValidation), ctrl.remove);

export default router;