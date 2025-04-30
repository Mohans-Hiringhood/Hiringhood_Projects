const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getCategories,
  createCategory,
  deleteCategory,
} = require('../controllers/categoryController');

router
  .route('/')
  .get(getCategories)
  .post(protect, authorize('admin'), createCategory);

router
  .route('/:id')
  .delete(protect, authorize('admin'), deleteCategory);

module.exports = router;