// server/controllers/studentController.js
const Student = require('../models/Student.js');

// @desc    Create a new student
// @route   POST /api/students
// @access  Private (Admin)
const createStudent = async (req, res) => {
  const { firstName, lastName, dateOfBirth } = req.body;
  if (!firstName || !lastName || !dateOfBirth) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }
  try {
    const student = new Student({ firstName, lastName, dateOfBirth });
    const createdStudent = await student.save();
    res.status(201).json(createdStudent);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Private (Admin, Teacher)
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Get a single student by ID
// @route   GET /api/students/:id
// @access  Private (Admin, Teacher)
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ msg: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private (Admin)
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (student) {
      student.firstName = req.body.firstName || student.firstName;
      student.lastName = req.body.lastName || student.lastName;
      student.dateOfBirth = req.body.dateOfBirth || student.dateOfBirth;
      const updatedStudent = await student.save();
      res.json(updatedStudent);
    } else {
      res.status(404).json({ msg: 'Student not found' });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private (Admin)
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (student) {
      await student.deleteOne();
      res.json({ msg: 'Student removed' });
    } else {
      res.status(404).json({ msg: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};