const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getUsers,
  updateUserRole,
  toggleUserStatus,
} = require('../controllers/userController');

router.use(protect, authorize('admin'));

router.get('/', getUsers);
router.put('/:id/role', updateUserRole);
router.put('/:id/status', toggleUserStatus);

module.exports = router;