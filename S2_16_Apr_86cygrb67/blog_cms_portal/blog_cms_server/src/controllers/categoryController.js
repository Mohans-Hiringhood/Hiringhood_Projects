const Category = require('../models/Category');
const Post = require('../models/Post');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private (Admin)
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const category = await Category.create({ name, slug });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a category (only if no posts are using it)
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
exports.deleteCategory = async (req, res) => {
  try {
    const posts = await Post.find({ category: req.params.id });
    if (posts.length > 0) {
      return res.status(400).json({ message: 'Cannot delete category with posts' });
    }
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};