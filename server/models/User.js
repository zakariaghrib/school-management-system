// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // L'email doit être unique
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'teacher', 'student', 'parent'], // Le rôle ne peut être que l'une de ces valeurs
    default: 'student', // Valeur par défaut
  },
  profileImage: {
    type: String,
    required: false,
  }
}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

const User = mongoose.model('User', userSchema);

module.exports = User;