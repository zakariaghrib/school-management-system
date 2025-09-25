const express = require('express');
const router = express.Router();
const {
  addGrade,
  getGradesForStudent,
  updateGrade,
  deleteGrade,
  getClassResults,
} = require('../controllers/gradeController.js');

const { protect } = require('../middlewares/authMiddleware.js');
const { authorize } = require('../middlewares/authorizationMiddleware.js');

// Protéger toutes les routes
router.use(protect);

// Seuls les admins et les profs peuvent ajouter/modifier/supprimer des notes
router.route('/')
  .post(authorize('admin', 'teacher'), addGrade);

router.route('/:id')
  .put(authorize('admin', 'teacher'), updateGrade)
  .delete(authorize('admin', 'teacher'), deleteGrade);

// Route pour obtenir toutes les notes d'un étudiant spécifique
router.route('/student/:studentId')
  .get(authorize('admin', 'teacher'), getGradesForStudent);
  
// Route pour obtenir les résultats d'une classe
router.route('/results/class/:classId')
  .get(authorize('admin', 'teacher'), getClassResults);

module.exports = router;