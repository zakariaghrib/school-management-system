const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Inscription publique (ne change pas)
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'Un utilisateur avec cet email existe déjà' });
    }
    const user = new User({ name, email, password, role });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.status(201).json({ msg: 'Utilisateur enregistré avec succès' });
  } catch (error) {
    res.status(500).json({ msg: 'Erreur du serveur' });
  }
};

// --- Connexion (Version Corrigée et Améliorée) ---
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Trouver l'utilisateur par son email
    const user = await User.findOne({ email });
    if (!user) {
      // Message générique pour la sécurité
      return res.status(401).json({ msg: 'Email ou mot de passe incorrect' });
    }

    // 2. Comparer le mot de passe fourni avec celui qui est haché dans la DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Email ou mot de passe incorrect' });
    }

    // 3. Si tout est correct, créer le token et renvoyer les informations
    const payload = {
      user: {
        id: user._id,
        role: user.role,
        name: user.name, // Ajouter le nom pour l'affichage
      }
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d', // Le token est valide pour 1 jour
    });

    res.json({
      token,
      // Renvoyer aussi les informations de l'utilisateur au frontend
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erreur du serveur' });
  }
};
// ---------------------------------------------------

const getAllUsers = async (req, res) => { /* ... (code existant) ... */ };
const resetPassword = async (req, res) => { /* ... (code existant) ... */ };

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  resetPassword,
};

