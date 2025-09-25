const express = require('express');
const router = express.Router();
const {
  addGrade,
  getClassResults,
  getDetailedClassResults,
} = require('../controllers/gradeController.js');

const { protect } = require('../middlewares/authMiddleware.js');
const { authorize } = require('../middlewares/authorizationMiddleware.js');

router.use(protect);
router.use(authorize('admin', 'teacher'));

router.route('/').post(addGrade);

// Route pour les résultats simples (moyenne générale)
router.get('/results/class/:classId', getClassResults);

// Route pour le bulletin de notes détaillé
router.get('/results/class/:classId/detailed', getDetailedClassResults);

module.exports = router;