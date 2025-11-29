/**
 * Archives Routes
 * 
 * Defines REST API endpoints for archive management with validation middleware.
 * Supports retrieving, creating, and deleting archive snapshots.
 */

import { Router } from 'express';
import * as ctrl from '../controllers/archives.controller';
import { archiveValidation, idParamValidation } from '../validators/entities.validator';
import { validate } from '../middleware/validation.middleware';

const router = Router();

router.get('/', ctrl.getAll);
router.get('/:id', validate(idParamValidation), ctrl.getById);
router.post('/', validate(archiveValidation), ctrl.create);
router.delete('/:id', validate(idParamValidation), ctrl.remove);

export default router;
