const express = require('express');
const router = express.Router();
const {
  createSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
} = require('../controllers/subjectController.js');

const { protect } = require('../middlewares/authMiddleware.js');
const { authorize } = require('../middlewares/authorizationMiddleware.js');

router.use(protect);

router.route('/')
  .get(authorize('admin', 'teacher'), getAllSubjects)
  .post(authorize('admin'), createSubject);

router.route('/:id')
  .put(authorize('admin'), updateSubject)
  .delete(authorize('admin'), deleteSubject);

module.exports = router;