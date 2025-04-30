import mongoose from 'mongoose';

const applicationSchema = mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Job',
    },
    jobSeeker: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    coverLetter: {
      type: String,
      required: true,
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'interviewed', 'rejected', 'accepted'],
      default: 'pending',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a job seeker can only apply once to a job
applicationSchema.index({ job: 1, jobSeeker: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;