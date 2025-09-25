// server/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController.js');

const { protect } = require('../middlewares/authMiddleware.js');
const { authorize } = require('../middlewares/authorizationMiddleware.js');

// Apply the 'protect' middleware to all routes in this file
router.use(protect);

// Routes
router.route('/')
  .post(authorize('admin','teacher'), createStudent) // Only admins can create
  .get(authorize('admin', 'teacher'), getAllStudents); // Admins and teachers can get all

router.route('/:id')
  .get(authorize('admin', 'teacher'), getStudentById) // Admins and teachers can get one
  .put(authorize('admin'), updateStudent) // Only admins can update
  .delete(authorize('admin'), deleteStudent); // Only admins can delete

module.exports = router;