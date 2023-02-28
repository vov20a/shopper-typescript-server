import { Router } from 'express';
import { create, getOne, getAll, remove, update } from '../controllers/CategoryController.js';
import { checkAuthAndAdmin, handleValidationErrors } from '../utils/index.js';
import { categoryCreateValidation } from '../validations.js';

const router = new Router();

//create
router.post(
  '/categories',
  checkAuthAndAdmin,
  categoryCreateValidation,
  handleValidationErrors,
  create,
);

//getOne
router.get('/categories/:id', handleValidationErrors, getOne);

//getAll
router.get('/categories', getAll);

//remove
router.delete('/categories/:id', checkAuthAndAdmin, remove);

//update
router.patch('/categories/:id', checkAuthAndAdmin, handleValidationErrors, update);

export default router;
