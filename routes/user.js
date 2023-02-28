import { Router } from 'express';
import {
  deleteUser,
  create,
  edit,
  getAll,
  getOne,
  getCount,
} from '../controllers/UserController.js';
import { checkAuthAndAdmin, handleValidationErrors } from '../utils/index.js';
import { registerValidation } from '../validations.js';

const router = new Router();

//'/:id', checkAuthAndAdmin, UserController.deleteUser
router.delete('/:id', handleValidationErrors, checkAuthAndAdmin, deleteUser);

// '/create',registerValidation,handleValidationErrors,checkAuthAndAdmin,UserController.create,
router.post('/create', registerValidation, handleValidationErrors, checkAuthAndAdmin, create);

// '/edit/:id',registerValidation,handleValidationErrors,checkAuthAndAdmin,UserController.edit,
router.patch('/edit/:id', registerValidation, handleValidationErrors, checkAuthAndAdmin, edit);

// '/users', checkAuthAndAdmin, UserController.getAll
router.get('/users', registerValidation, handleValidationErrors, checkAuthAndAdmin, getAll);

// /users/:id', checkAuthAndAdmin, UserController.getOne
router.get('/users/:id', checkAuthAndAdmin, getOne);

// /count', UserController.getCount
router.get('/count', getCount);

export default router;
