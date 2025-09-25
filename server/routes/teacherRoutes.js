// server/routes/teacherRoutes.js
const express = require('express');
const router = express.Router();
const {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} = require('../controllers/teacherController.js');

const { protect } = require('../middlewares/authMiddleware.js');
const { authorize } = require('../middlewares/authorizationMiddleware.js');

// Protect all routes and restrict to admin
router.use(protect, authorize('admin'));

router.route('/')
  .post(createTeacher)
  .get(getAllTeachers);

router.route('/:id')
  .get(getTeacherById)
  .put(updateTeacher)
  .delete(deleteTeacher);

module.exports = router;