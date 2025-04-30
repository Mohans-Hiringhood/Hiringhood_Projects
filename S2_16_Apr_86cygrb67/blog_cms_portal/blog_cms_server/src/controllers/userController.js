const User = require('../models/User');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private (Admin)
exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle user status (Admin only)
// @route   PUT /api/users/:id/status
// @access  Private (Admin)
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.disabled = !user.disabled;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};