const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser,
  getAllUsers,
  resetPassword
} = require('../controllers/userController.js');
const { protect } = require('../middlewares/authMiddleware.js');
const { authorize } = require('../middlewares/authorizationMiddleware.js');

// --- Routes Publiques ---
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- Routes Protégées pour l'Admin ---
router.get('/', protect, authorize('admin'), getAllUsers);
router.put('/reset-password/:id', protect, authorize('admin'), resetPassword);

module.exports = router;