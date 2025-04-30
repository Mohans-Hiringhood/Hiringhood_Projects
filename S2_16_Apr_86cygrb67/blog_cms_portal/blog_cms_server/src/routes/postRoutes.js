const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getPosts,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');

router
  .route('/')
  .get(getPosts)
  .post(protect, authorize('editor', 'admin'), createPost);

router
  .route('/:id')
  .put(protect, authorize('editor', 'admin'), updatePost)
  .delete(protect, authorize('editor', 'admin'), deletePost);

module.exports = router;