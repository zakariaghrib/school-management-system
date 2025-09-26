const express = require('express');
const router = express.Router();
const {
  createSubject,
  getAllSubjects,
  deleteSubject,
} = require('../controllers/subjectController.js');
const { protect } = require('../middlewares/authMiddleware.js');
const { authorize } = require('../middlewares/authorizationMiddleware.js');

router.use(protect);

router.get('/', authorize('admin', 'teacher'), getAllSubjects);
router.post('/', authorize('admin'), createSubject);
router.delete('/:id', authorize('admin'), deleteSubject);

module.exports = router;