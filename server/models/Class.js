// server/models/Class.js
const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: String,
    required: true,
    trim: true,
  },
  mainTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher', // Référence au modèle Teacher
    required: false, // Une classe peut être créée avant d'assigner un prof principal
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // C'est une liste de références au modèle Student
  }],
}, {
  timestamps: true,
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;