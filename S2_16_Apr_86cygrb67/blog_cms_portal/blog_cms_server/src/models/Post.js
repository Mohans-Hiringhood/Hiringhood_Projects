const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  tags: [String],
  featuredImage: String,
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);