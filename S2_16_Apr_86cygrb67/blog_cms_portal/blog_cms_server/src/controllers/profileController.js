const User = require('../models/User');

// @desc    Update profile
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, email, avatar },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Change password
// @route   PUT /api/profile/password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('+password');
    const { currentPassword, newPassword } = req.body;

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};