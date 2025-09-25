// server/controllers/teacherController.js
const Teacher = require('../models/Teacher.js');

// @desc    Create a new teacher
// @route   POST /api/teachers
// @access  Private (Admin)
const createTeacher = async (req, res) => {
  const { firstName, lastName, contact } = req.body;
  if (!firstName || !lastName || !contact || !contact.email) {
    return res.status(400).json({ msg: 'Please provide firstName, lastName, and a contact email' });
  }

  try {
    const teacherExists = await Teacher.findOne({ 'contact.email': contact.email });
    if (teacherExists) {
      return res.status(400).json({ msg: 'A teacher with this email already exists' });
    }

    const teacher = new Teacher({ firstName, lastName, contact });
    const createdTeacher = await teacher.save();
    res.status(201).json(createdTeacher);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private (Admin)
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({});
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Get a single teacher by ID
// @route   GET /api/teachers/:id
// @access  Private (Admin)
const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (teacher) {
      res.json(teacher);
    } else {
      res.status(404).json({ msg: 'Teacher not found' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Update a teacher
// @route   PUT /api/teachers/:id
// @access  Private (Admin)
const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (teacher) {
      teacher.firstName = req.body.firstName || teacher.firstName;
      teacher.lastName = req.body.lastName || teacher.lastName;
      teacher.contact = req.body.contact || teacher.contact;
      const updatedTeacher = await teacher.save();
      res.json(updatedTeacher);
    } else {
      res.status(404).json({ msg: 'Teacher not found' });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// @desc    Delete a teacher
// @route   DELETE /api/teachers/:id
// @access  Private (Admin)
const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (teacher) {
      await teacher.deleteOne();
      res.json({ msg: 'Teacher removed' });
    } else {
      res.status(404).json({ msg: 'Teacher not found' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports = {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};