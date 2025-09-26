const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  dateOfBirth: { 
    type: Date, 
    required: true 
  },
  class: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class' 
  },
  // --- LIGNE AJOUTÉE ---
  // Lien vers le document User qui contient l'email et le mot de passe
  userAccount: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true // Chaque profil étudiant ne peut être lié qu'à un seul compte
  },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;