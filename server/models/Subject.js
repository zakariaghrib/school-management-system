// server/models/Subject.js
const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
}, {
  timestamps: true,
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;