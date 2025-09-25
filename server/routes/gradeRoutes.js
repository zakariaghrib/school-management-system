const express = require('express');
const router = express.Router();
const {
  addGrade,
  getGradesForClass,
  updateGrade,
  deleteGrade,
  getDetailedClassResults,
} = require('../controllers/gradeController.js');

const { protect } = require('../middlewares/authMiddleware.js');
const { authorize } = require('../middlewares/authorizationMiddleware.js');

router.use(protect);
router.use(authorize('admin', 'teacher'));

router.route('/').post(addGrade);

router.get('/results/class/:classId/detailed', getDetailedClassResults);
router.get('/class/:classId', getGradesForClass);

router.route('/:id')
  .put(updateGrade)
  .delete(deleteGrade);

module.exports = router;