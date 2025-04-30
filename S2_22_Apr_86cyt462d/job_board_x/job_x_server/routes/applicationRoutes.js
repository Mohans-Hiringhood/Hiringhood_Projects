import express from 'express';
import {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { protect, employer, jobSeeker } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, jobSeeker, applyToJob);
router.get('/me', protect, jobSeeker, getMyApplications);
router.get('/job/:id', protect, employer, getJobApplications);
router.put('/:id', protect, employer, updateApplicationStatus);

export default router;