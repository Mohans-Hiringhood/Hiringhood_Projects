const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  updateProfile,
  changePassword,
} = require('../controllers/profileController');

router.use(protect);

router.put('/', updateProfile);
router.put('/password', changePassword);

module.exports = router;