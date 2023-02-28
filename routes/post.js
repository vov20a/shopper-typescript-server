import { Router } from 'express';
import { create, getAll, getOne, remove, update } from '../controllers/PostController.js';
import { checkAuthAndAdmin, handleValidationErrors } from '../utils/index.js';
import { postCreateValidation } from '../validations.js';

const router = new Router();

// app.post('/posts',checkAuthAndAdmin,postCreateValidation,handleValidationErrors,PostController.create,); //create one post
router.post('', checkAuthAndAdmin, postCreateValidation, handleValidationErrors, create);

//   app.get('/posts', PostController.getAll);
router.post('', getAll);

//   app.get('/posts/:id', PostController.getOne);
router.get('/:id', getOne);

//   app.delete('/posts/:id', checkAuthAndAdmin, PostController.remove);
router.delete('/:id', checkAuthAndAdmin, remove);

//   app.patch('/posts/:id', checkAuthAndAdmin, handleValidationErrors, PostController.update);
router.patch('/:id', checkAuthAndAdmin, handleValidationErrors, update);

export default router;
