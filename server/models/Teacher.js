// server/models/Teacher.js
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  contact: {
    email: { type: String, required: true, unique: true },
    phone: { type: String },
  },
  // We can link to subjects they teach later
  // subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }]
}, {
  timestamps: true,
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;