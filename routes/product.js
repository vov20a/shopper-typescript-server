import { Router } from 'express';
import {
  getCount,
  create,
  getAll,
  getOne,
  getProductsByCategory,
  getRandomizeProducts,
  remove,
  update,
} from '../controllers/ProductController.js';
import { checkAuthAndAdmin, handleValidationErrors } from '../utils/index.js';
import { productCreateValidation } from '../validations.js';

const router = new Router();

//getCount
router.get('/products/count', getCount);

//create
router.post(
  '/products',
  checkAuthAndAdmin,
  productCreateValidation,
  handleValidationErrors,
  create,
);

//getAll
router.get('/products', getAll);

//getOne
router.get('/products/:id', getOne);

//getProductsByCategory
router.get('/products/categories/:categoryId', getProductsByCategory);

//getRandomizeProducts
router.get('/randomize/products', getRandomizeProducts);

//remove
router.delete('/products/:id', checkAuthAndAdmin, remove);

//update
router.patch('/products/:id', checkAuthAndAdmin, handleValidationErrors, update);

export default router;
