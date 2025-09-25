const express = require('express');
const router = express.Router();
const {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  addStudentToClass,
  removeStudentFromClass,
} = require('../controllers/classController.js');

const { protect } = require('../middlewares/authMiddleware.js');
const { authorize } = require('../middlewares/authorizationMiddleware.js');

router.use(protect);

router.route('/')
  .get(authorize('admin', 'teacher'), getAllClasses)
  .post(authorize('admin'), createClass);

router.route('/:id')
  .get(authorize('admin', 'teacher'), getClassById)
  .put(authorize('admin'), updateClass);

router.route('/:classId/students/:studentId')
  .put(authorize('admin', 'teacher'), addStudentToClass)
  .delete(authorize('admin', 'teacher'), removeStudentFromClass);

module.exports = router;