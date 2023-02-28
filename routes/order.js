import { Router } from 'express';
import { create, getAll, getCount, getOne, remove } from '../controllers/OrderController.js';
import { checkAuthAndAdmin, handleValidationErrors } from '../utils/index.js';
import { orderCreateValidation } from '../validations.js';

const router = new Router();

// app.get('/orders/count', OrderController.getCount)
router.get('/count', getCount);

// app.post('/orders', checkAuthAndAdmin,orderCreateValidation,handleValidationErrors,OrderController.create,);
router.post('', checkAuthAndAdmin, orderCreateValidation, handleValidationErrors, create);

// app.get('/orders', checkAuthAndAdmin, OrderController.getAll);
router.get('', checkAuthAndAdmin, getAll);

// app.get('/orders/:id', checkAuthAndAdmin, OrderController.getOne);
router.get('/:id', checkAuthAndAdmin, getOne);

// app.delete('/orders/:id', checkAuthAndAdmin, OrderController.remove);
router.delete('/:id', checkAuthAndAdmin, remove);

export default router;
