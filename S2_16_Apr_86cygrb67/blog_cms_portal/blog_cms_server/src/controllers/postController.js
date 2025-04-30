const Post = require('../models/Post');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email avatar')
      .populate('category', 'name');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a post
// @route   POST /api/posts
// @access  Private (Editor/Admin)
exports.createPost = async (req, res) => {
  try {
    const { title, content, status, category, tags } = req.body;
    const post = await Post.create({
      title,
      content,
      status,
      category,
      tags,
      author: req.userId,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (Author/Admin)
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (Author/Admin)
exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};