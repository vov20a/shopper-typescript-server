import { Router } from 'express';
import { checkEmail, postMail, updateUser } from '../controllers/MailController.js';
import { handleValidationErrors } from '../utils/index.js';

const router = new Router();

// '/mail', MailController.postMail
router.post('/mail', postMail);

// /auth/restore', handleValidationErrors, UserController.checkEmail
router.post('/auth/restore', handleValidationErrors, checkEmail);

// /auth/password', handleValidationErrors, UserController.updateUser
router.post('/auth/password', handleValidationErrors, updateUser);

export default router;
