const express = require('express');
const router = express.Router();
const {
  addGrade,
  getGradesForClass,
  updateGrade,
  deleteGrade,
  getDetailedClassResults,
  getMyResults, // S'assurer que cette fonction est bien importée
} = require('../controllers/gradeController.js');
const { protect } = require('../middlewares/authMiddleware.js');
const { authorize } = require('../middlewares/authorizationMiddleware.js');

// Route pour l'étudiant
router.get('/my-results', protect, authorize('student'), getMyResults);

// Routes pour Admin/Enseignant
router.use(protect, authorize('admin', 'teacher'));

router.post('/', addGrade);
router.get('/class/:classId', getGradesForClass);
router.get('/results/class/:classId/detailed', getDetailedClassResults);

router.route('/:id')
  .put(updateGrade)
  .delete(deleteGrade);

module.exports = router;