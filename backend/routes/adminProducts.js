const express = require('express');
const router = express.Router();
const { adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(adminGetProducts)
  .post(adminCreateProduct);

router.route('/:id')
  .put(adminUpdateProduct)
  .delete(adminDeleteProduct);

module.exports = router;
