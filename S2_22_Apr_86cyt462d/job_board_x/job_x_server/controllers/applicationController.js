import asyncHandler from 'express-async-handler';
import Application from '../models/applicationModel.js';
import Job from '../models/jobModel.js';

// @desc    Apply to a job
// @route   POST /api/applications
// @access  Private/JobSeeker
export const applyToJob = asyncHandler(async (req, res) => {
  const { jobId, coverLetter, resumeUrl } = req.body;

  // Check if job exists
  const job = await Job.findById(jobId);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check if job is still active
  if (!job.isActive) {
    res.status(400);
    throw new Error('This job is no longer accepting applications');
  }

  // Check if already applied
  const alreadyApplied = await Application.findOne({
    job: jobId,
    jobSeeker: req.user._id,
  });

  if (alreadyApplied) {
    res.status(400);
    throw new Error('You have already applied to this job');
  }

  // Create application
  const application = await Application.create({
    job: jobId,
    jobSeeker: req.user._id,
    coverLetter,
    resumeUrl,
  });

  // Increment application count on the job
  await Job.findByIdAndUpdate(jobId, {
    $inc: { applicationsCount: 1 },
  });

  res.status(201).json(application);
});

// @desc    Get job seeker's applications
// @route   GET /api/applications/me
// @access  Private/JobSeeker
export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ jobSeeker: req.user._id })
    .populate({
      path: 'job',
      select: 'title company location type salary',
    })
    .sort({ createdAt: -1 });

  res.json(applications);
});

// @desc    Get applications for a job
// @route   GET /api/applications/job/:id
// @access  Private/Employer
export const getJobApplications = asyncHandler(async (req, res) => {
  const jobId = req.params.id;

  // Check if job exists and belongs to the employer
  const job = await Job.findOne({
    _id: jobId,
    employer: req.user._id,
  });

  if (!job) {
    res.status(404);
    throw new Error('Job not found or you are not authorized to view these applications');
  }

  const applications = await Application.find({ job: jobId })
    .populate({
      path: 'jobSeeker',
      select: 'name email',
    })
    .sort({ createdAt: -1 });

  res.json(applications);
});

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private/Employer
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  
  const application = await Application.findById(req.params.id)
    .populate('job');

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Check if job belongs to the employer
  const job = await Job.findOne({
    _id: application.job._id,
    employer: req.user._id,
  });

  if (!job) {
    res.status(403);
    throw new Error('Not authorized to update this application');
  }

  // Update status and notes
  application.status = status || application.status;
  application.notes = notes || application.notes;

  await application.save();

  res.json(application);
});