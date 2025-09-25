// server/controllers/subjectController.js
const Subject = require('../models/Subject.js');

// @desc    Create a new subject
// @access  Private (Admin)
const createSubject = async (req, res) => {
  const { name, description } = req.body;
  try {
    const subjectExists = await Subject.findOne({ name });
    if (subjectExists) {
      return res.status(400).json({ msg: 'Subject already exists' });
    }
    const subject = new Subject({ name, description });
    const createdSubject = await subject.save();
    res.status(201).json(createdSubject);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// @desc    Get all subjects
// @access  Private (Admin)
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({});
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Update a subject
// @access  Private (Admin)
const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subject) {
      return res.status(404).json({ msg: 'Subject not found' });
    }
    res.json(subject);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// @desc    Delete a subject
// @access  Private (Admin)
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (subject) {
      await subject.deleteOne();
      res.json({ msg: 'Subject removed' });
    } else {
      res.status(44).json({ msg: 'Subject not found' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports = {
  createSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
};