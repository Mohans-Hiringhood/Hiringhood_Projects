import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export const employer = (req, res, next) => {
  if (req.user && req.user.role === 'employer') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an employer');
  }
};

export const jobSeeker = (req, res, next) => {
  if (req.user && req.user.role === 'jobSeeker') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as a job seeker');
  }
};