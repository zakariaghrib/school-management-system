// server/routes/subjectRoutes.js
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

// Protéger toutes les routes et les restreindre aux administrateurs
router.use(protect, authorize('admin'));

router.route('/')
  .post(createSubject)
  .get(getAllSubjects);

router.route('/:id')
  .put(updateSubject)
  .delete(deleteSubject);

module.exports = router;