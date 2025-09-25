// server/controllers/classController.js
const Class = require('../models/Class.js');

// @desc    Create a new class
// @access  Private (Admin)
const createClass = async (req, res) => {
  const { name, year, mainTeacher } = req.body;
  try {
    const newClass = new Class({ name, year, mainTeacher });
    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// @desc    Get all classes
// @access  Private (Admin)
const getAllClasses = async (req, res) => {
  try {
    // .populate() remplace les IDs par les données complètes des profs et étudiants
    const classes = await Class.find({}).populate('mainTeacher', 'firstName lastName').populate('students', 'firstName lastName');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Get a single class by ID
// @access  Private (Admin)
const getClassById = async (req, res) => {
  try {
    const singleClass = await Class.findById(req.params.id).populate('mainTeacher', 'firstName lastName').populate('students', 'firstName lastName');
    if (!singleClass) {
      return res.status(404).json({ msg: 'Class not found' });
    }
    res.json(singleClass);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Update a class
// @access  Private (Admin)
const updateClass = async (req, res) => {
  try {
    const singleClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
     if (!singleClass) {
      return res.status(404).json({ msg: 'Class not found' });
    }
    res.json(singleClass);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// @desc    Add a student to a class
// @access  Private (Admin)
const addStudentToClass = async (req, res) => {
  try {
    const { classId, studentId } = req.params;
    const singleClass = await Class.findById(classId);
    if (!singleClass) {
      return res.status(404).json({ msg: 'Class not found' });
    }
    // Ajoute l'ID de l'étudiant à la liste s'il n'y est pas déjà
    if (!singleClass.students.includes(studentId)) {
      singleClass.students.push(studentId);
      await singleClass.save();
    }
    res.json(singleClass);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// @desc    Remove a student from a class
// @access  Private (Admin)
const removeStudentFromClass = async (req, res) => {
  try {
    const { classId, studentId } = req.params;
    const singleClass = await Class.findById(classId);
    if (!singleClass) {
      return res.status(404).json({ msg: 'Class not found' });
    }
    // Retire l'ID de l'étudiant de la liste
    singleClass.students = singleClass.students.filter(
      (id) => id.toString() !== studentId
    );
    await singleClass.save();
    res.json(singleClass);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  addStudentToClass,
  removeStudentFromClass,
};