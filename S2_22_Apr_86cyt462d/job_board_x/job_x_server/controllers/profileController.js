import asyncHandler from 'express-async-handler';
import Profile from '../models/profileModel.js';

// @desc    Get current user profile
// @route   GET /api/profile/me
// @access  Private
export const getCurrentProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });

  if (!profile) {
    res.status(404);
    throw new Error('Profile not found');
  }

  res.json(profile);
});

// @desc    Create or update user profile
// @route   POST /api/profile
// @access  Private
export const createUpdateProfile = asyncHandler(async (req, res) => {
  const {
    bio,
    location,
    skills,
    experience,
    education,
    resumeUrl,
    socialLinks,
  } = req.body;

  // Build profile object
  const profileFields = {
    user: req.user._id,
    bio,
    location,
    skills: Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim()),
    resumeUrl,
    socialLinks,
  };

  // Check if profile exists
  let profile = await Profile.findOne({ user: req.user._id });

  if (profile) {
    // Update profile
    profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profileFields },
      { new: true }
    );
    
    // Update experience if provided
    if (experience) {
      profile.experience = experience;
    }
    
    // Update education if provided
    if (education) {
      profile.education = education;
    }
    
    await profile.save();
    
    return res.json(profile);
  }

  // Create profile
  profile = new Profile(profileFields);

  // Add experience if provided
  if (experience) {
    profile.experience = experience;
  }
  
  // Add education if provided
  if (education) {
    profile.education = education;
  }

  await profile.save();
  res.status(201).json(profile);
});

// @desc    Get profile by user ID
// @route   GET /api/profile/user/:id
// @access  Public
export const getProfileByUserId = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.params.id });

  if (!profile) {
    res.status(404);
    throw new Error('Profile not found');
  }

  res.json(profile);
});