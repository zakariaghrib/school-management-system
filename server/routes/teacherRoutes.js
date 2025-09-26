const express = require('express');
const router = express.Router();
const {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getMyClasses,
} = require('../controllers/teacherController.js');
const { protect } = require('../middlewares/authMiddleware.js');
const { authorize } = require('../middlewares/authorizationMiddleware.js');

router.get('/my-classes', protect, authorize('teacher'), getMyClasses);

router.route('/')
  .get(protect, authorize('admin'), getAllTeachers)
  .post(protect, authorize('admin'), createTeacher);

router.route('/:id')
  .get(protect, authorize('admin'), getTeacherById)
  .put(protect, authorize('admin'), updateTeacher)
  .delete(protect, authorize('admin'), deleteTeacher);

module.exports = router;