import { Router } from 'express';
import * as ctrl from '../controllers/aircraft.controller';
import { aircraftValidation, idParamValidation } from '../validators/entities.validator';
import { validate } from '../middleware/validation.middleware';

const router = Router();
router.get('/', ctrl.getAll);
router.get('/:id', validate(idParamValidation), ctrl.getById);
router.post('/', validate(aircraftValidation), ctrl.create);
router.put('/:id', validate([...idParamValidation, ...aircraftValidation]), ctrl.update);
router.delete('/:id', validate(idParamValidation), ctrl.remove);
export default router;