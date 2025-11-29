/**
 * Aircraft routes module.
 * Defines RESTful endpoints for aircraft CRUD operations with authentication and validation middleware.
 */
import { Router } from 'express';
import * as ctrl from '../controllers/aircraft.controller';
import { aircraftValidation, idParamValidation } from '../validators/entities.validator';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /aircraft - Fetch all aircraft
router.get('/', ctrl.getAll);

// GET /aircraft/:id - Fetch aircraft by ID
router.get('/:id', validate(idParamValidation), ctrl.getById);

// POST /aircraft - Create new aircraft
router.post('/', validate(aircraftValidation), ctrl.create);

// PUT /aircraft/:id - Update aircraft
router.put('/:id', validate([...idParamValidation, ...aircraftValidation]), ctrl.update);

// DELETE /aircraft/:id - Delete aircraft
router.delete('/:id', validate(idParamValidation), ctrl.remove);

export default router;