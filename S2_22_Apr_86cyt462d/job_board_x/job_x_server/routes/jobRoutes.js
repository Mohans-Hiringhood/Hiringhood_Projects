import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs
} from '../controllers/jobController.js';
import { protect, employer } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/employer', protect, employer, getEmployerJobs);
router.get('/:id', getJobById);
router.post('/', protect, employer, createJob);
router.put('/:id', protect, employer, updateJob);
router.delete('/:id', protect, employer, deleteJob);

export default router;