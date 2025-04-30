import asyncHandler from 'express-async-handler';
import Job from '../models/jobModel.js';

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = asyncHandler(async (req, res) => {
  const { 
    search, 
    location, 
    type, 
    company, 
    page = 1, 
    limit = 10 
  } = req.query;

  // Build filter object
  const filter = { isActive: true };
  
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { skills: { $in: [new RegExp(search, 'i')] } },
    ];
  }
  
  if (location) {
    filter.location = { $regex: location, $options: 'i' };
  }
  
  if (type) {
    filter.type = type;
  }
  
  if (company) {
    filter.company = { $regex: company, $options: 'i' };
  }

  // Count total documents for pagination
  const total = await Job.countDocuments(filter);
  
  // Get jobs with pagination
  const jobs = await Job.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit)
    .populate('employer', 'name company');

  res.json({
    jobs,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get a single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('employer', 'name company');

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  res.json(job);
});

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private/Employer
export const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    location,
    description,
    requirements,
    type,
    salary,
    skills,
    applicationDeadline,
  } = req.body;

  const job = await Job.create({
    employer: req.user._id,
    company: req.user.company,
    title,
    location,
    description,
    requirements,
    type,
    salary,
    skills: Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim()),
    applicationDeadline,
  });

  res.status(201).json(job);
});

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Employer
export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check if job belongs to user
  if (job.employer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('User not authorized to update this job');
  }

  // Update skills if provided as string
  if (req.body.skills && !Array.isArray(req.body.skills)) {
    req.body.skills = req.body.skills.split(',').map(skill => skill.trim());
  }

  const updatedJob = await Job.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedJob);
});

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Employer
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check if job belongs to user
  if (job.employer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('User not authorized to delete this job');
  }

  await job.deleteOne();
  res.json({ message: 'Job removed' });
});

// @desc    Get employer's jobs
// @route   GET /api/jobs/employer
// @access  Private/Employer
export const getEmployerJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });

  res.json(jobs);
});