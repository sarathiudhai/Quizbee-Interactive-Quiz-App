const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateProfile,
  getDashboardStats
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

// Profile route for logged-in user (must come before /:id)
router.put('/profile', protect, updateProfile);

// Dashboard stats (admin)
router.get('/stats/dashboard', protect, adminOnly, getDashboardStats);

// Admin user management
router.route('/')
  .get(protect, adminOnly, getUsers);

router.route('/:id')
  .get(protect, adminOnly, getUser)
  .put(protect, adminOnly, updateUser)
  .delete(protect, adminOnly, deleteUser);

module.exports = router;
