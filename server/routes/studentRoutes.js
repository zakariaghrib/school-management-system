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

router.use(protect);

router.route('/')
  .get(authorize('admin', 'teacher'), getAllStudents)
  .post(authorize('admin', 'teacher'), createStudent);

router.route('/:id')
  .get(authorize('admin', 'teacher'), getStudentById)
  .put(authorize('admin'), updateStudent)
  .delete(authorize('admin'), deleteStudent);

module.exports = router;