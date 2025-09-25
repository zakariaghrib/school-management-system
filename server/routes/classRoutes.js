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

// --- Note : On ne met plus de router.use global pour authorize ici ---
// On applique seulement la protection de base (doit être connecté)
router.use(protect);

// --- On définit les permissions pour chaque route ---

router.route('/')
  // Seul un admin peut créer une classe
  .post(authorize('admin'), createClass)
  // Un admin OU un enseignant peut voir la liste des classes
  .get(authorize('admin', 'teacher'), getAllClasses);

router.route('/:id')
  // Un admin OU un enseignant peut voir les détails d'UNE classe
  .get(authorize('admin', 'teacher'), getClassById)
  // Seul un admin peut modifier les détails d'une classe
  .put(authorize('admin'), updateClass);

// Route pour ajouter/retirer un étudiant d'une classe (admin seulement)
router.route('/:classId/students/:studentId')
  .put(authorize('admin'), addStudentToClass)
  .delete(authorize('admin'), removeStudentFromClass);

module.exports = router;
