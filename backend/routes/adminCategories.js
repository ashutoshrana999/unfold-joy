const express = require('express');
const router = express.Router();
const { adminCreateCategory, adminUpdateCategory, adminDeleteCategory } = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', adminCreateCategory);
router.route('/:id')
  .put(adminUpdateCategory)
  .delete(adminDeleteCategory);

module.exports = router;
