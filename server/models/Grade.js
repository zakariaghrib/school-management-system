// server/models/Grade.js
const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  grade: {
    type: Number,
    required: true,
    min: 0,
    max: 20, // Ou une autre note maximale
  },
  examType: {
    type: String,
    required: true,
    trim: true, // ex: "Contrôle 1", "Examen Final"
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: false, // Le professeur qui a donné la note
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;