// server/routes/classRoutes.js
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

// Protéger toutes les routes et les restreindre aux administrateurs
router.use(protect, authorize('admin'));

router.route('/')
  .post(createClass)
  .get(getAllClasses);

router.route('/:id')
  .get(getClassById)
  .put(updateClass);

// Route pour ajouter/retirer un étudiant d'une classe
router.route('/:classId/students/:studentId')
  .put(addStudentToClass)
  .delete(removeStudentFromClass);

module.exports = router;