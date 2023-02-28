import { Router } from 'express';
import { register, login, getMe } from '../controllers/UserController.js';
import { checkAuthAndAdmin, handleValidationErrors } from '../utils/index.js';
import { registerValidation } from '../validations.js';

const router = new Router();

//register
router.post('/register', registerValidation, handleValidationErrors, register);

//login
router.post('/login', handleValidationErrors, login);

//getMe
router.get('/getMe', handleValidationErrors, checkAuthAndAdmin, getMe);

export default router;
