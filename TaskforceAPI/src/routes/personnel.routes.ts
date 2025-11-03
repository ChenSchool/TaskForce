import { Router } from 'express';
import * as ctrl from '../controllers/personnel.controller';
import { personnelValidation, idParamValidation } from '../validators/entities.validator';
import { validate } from '../middleware/validation.middleware';

const router = Router();
router.get('/', ctrl.getAll);
router.get('/shift/:shift', ctrl.getByShift);
router.get('/:id', validate(idParamValidation), ctrl.getById);
router.post('/', validate(personnelValidation), ctrl.create);
router.put('/:id', validate([...idParamValidation, ...personnelValidation]), ctrl.update);
router.delete('/:id', validate(idParamValidation), ctrl.remove);
export default router;