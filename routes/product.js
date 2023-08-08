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
  // getAllAggregate,
} from '../controllers/ProductController.js';
import { checkAuthAndAdmin, handleValidationErrors } from '../utils/index.js';
import { productCreateValidation } from '../validations.js';

const router = new Router();

//getCount
router.get('/products/count', getCount);

//create
router.post(
  '/products',
  //временно закомментировал
  checkAuthAndAdmin,
  productCreateValidation,
  handleValidationErrors,
  create,
);

//getAll
router.get('/products', getAll);

// //getAllAggregate
// router.get('/productsAggr', getAllAggregate);

//getOne
router.get('/products/:id', getOne);

//getProductsByCategory
router.get('/products/categories/:categoryId', getProductsByCategory);

//getRandomizeProducts
router.get('/randomize/products', getRandomizeProducts);

//remove
router.delete(
  '/products/:id',
  //временно закомментировал
  checkAuthAndAdmin,
  remove,
);

//update
router.patch(
  '/products/:id',
  //временно закомментировал
  checkAuthAndAdmin,
  handleValidationErrors,
  update,
);

export default router;
