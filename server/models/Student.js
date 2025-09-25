// server/models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },

}, {
  timestamps: true,
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;