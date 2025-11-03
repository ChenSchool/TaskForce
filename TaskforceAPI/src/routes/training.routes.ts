import { Router } from 'express';
import * as ctrl from '../controllers/training.controller';
import { trainingValidation, idParamValidation } from '../validators/entities.validator';
import { validate } from '../middleware/validation.middleware';

const router = Router();

router.get('/', ctrl.getAll);
router.get('/stats', ctrl.getStats);
router.get('/personnel/:personnelId', ctrl.getByPersonnelId);
router.get('/:id', validate(idParamValidation), ctrl.getById);
router.post('/', validate(trainingValidation), ctrl.create);
router.put('/:id', validate([...idParamValidation, ...trainingValidation]), ctrl.update);
router.delete('/:id', validate(idParamValidation), ctrl.remove);

export default router;
