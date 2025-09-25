// server/controllers/gradeController.js
const Grade = require('../models/Grade.js');

// @desc    Add a new grade
// @access  Private (Admin, Teacher)
const addGrade = async (req, res) => {
  const { student, subject, grade, examType, teacher } = req.body;
  try {
    const newGrade = new Grade({ student, subject, grade, examType, teacher });
    const savedGrade = await newGrade.save();
    res.status(201).json(savedGrade);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// @desc    Get all grades for a specific student
// @access  Private (Admin, Teacher)
const getGradesForStudent = async (req, res) => {
  try {
    // On utilise .populate pour afficher les détails de la matière au lieu de juste l'ID
    const grades = await Grade.find({ student: req.params.studentId })
      .populate('subject', 'name')
      .populate('teacher', 'firstName lastName');
    res.json(grades);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Update a grade
// @access  Private (Admin, Teacher)
const updateGrade = async (req, res) => {
  try {
    const grade = await Grade.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!grade) {
      return res.status(404).json({ msg: 'Grade not found' });
    }
    res.json(grade);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// @desc    Delete a grade
// @access  Private (Admin, Teacher)
const deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (grade) {
      await grade.deleteOne();
      res.json({ msg: 'Grade removed' });
    } else {
      res.status(404).json({ msg: 'Grade not found' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports = {
  addGrade,
  getGradesForStudent,
  updateGrade,
  deleteGrade,
};