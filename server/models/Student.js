const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis.'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Le nom de famille est requis.'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'La date de naissance est requise.']
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: false // Peut être non assigné au début
  },
  // --- LIAISON AVEC LE COMPTE UTILISATEUR ---
  // Cette ligne est essentielle pour que l'étudiant puisse voir ses notes.
  userAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    sparse: true // Permet d'avoir des profils étudiants sans compte au début
  },
}, {
  timestamps: true // Ajoute les champs createdAt et updatedAt
});

module.exports = mongoose.model('Student', studentSchema);