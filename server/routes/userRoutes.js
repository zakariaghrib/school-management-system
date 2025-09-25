// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile 
} = require('../controllers/userController.js');
const { protect } = require('../middlewares/authMiddleware.js');

// === Public Routes ===
// URL -> POST http://localhost:5000/api/users/register
router.post('/register', registerUser);

// URL -> POST http://localhost:5000/api/users/login
router.post('/login', loginUser);

// === Private Routes ===
// URL -> GET http://localhost:5000/api/users/profile
// The 'protect' middleware runs first. If the token is valid, it calls getUserProfile.
router.get('/profile', protect, getUserProfile);

module.exports = router;