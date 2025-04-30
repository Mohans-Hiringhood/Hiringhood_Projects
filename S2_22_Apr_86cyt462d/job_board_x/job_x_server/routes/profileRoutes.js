import express from 'express';
import {
  getCurrentProfile,
  createUpdateProfile,
  getProfileByUserId
} from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', protect, getCurrentProfile);
router.post('/', protect, createUpdateProfile);
router.get('/user/:id', getProfileByUserId);

export default router;