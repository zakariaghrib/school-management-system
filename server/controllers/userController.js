const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// -------------------------------------------------------------------
// Inscription (Register)
// -------------------------------------------------------------------
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
        // Optionnel: console.error(error);
        res.status(500).json({ msg: 'Erreur du serveur' });
    }
};

// -------------------------------------------------------------------
// Connexion (Login)
// -------------------------------------------------------------------
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1. Trouver l'utilisateur par son email
        const user = await User.findOne({ email });
        if (!user) {
            // Message générique pour la sécurité
            return res.status(401).json({ msg: 'Email ou mot de passe incorrect' });
        }

        // 2. Comparer le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Email ou mot de passe incorrect' });
        }

        // 3. Créer le payload du token
        const payload = {
            user: {
                id: user._id,
                role: user.role,
                name: user.name,
            }
        };
        
        // 4. Signer le token (avec expiration de 1 jour)
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        // 5. Renvoyer le token et les informations de l'utilisateur
        res.json({
            token,
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role 
            },
        });

    } catch (error) {
        // Optionnel: console.error(error);
        res.status(500).json({ msg: 'Erreur du serveur' });
    }
};

// -------------------------------------------------------------------
// Obtenir tous les utilisateurs (Admin seulement)
// -------------------------------------------------------------------
const getAllUsers = async (req, res) => {
    try {
        // On récupère tous les utilisateurs sauf les administrateurs et on exclut le mot de passe
        const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ msg: 'Erreur du serveur' });
    }
};

// -------------------------------------------------------------------
// Réinitialisation du mot de passe (Admin seulement)
// -------------------------------------------------------------------
const resetPassword = async (req, res) => {
    const { password } = req.body;
    if (!password || password.length < 6) {
        return res.status(400).json({ msg: 'Veuillez fournir un nouveau mot de passe de 6 caractères minimum.' });
    }
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'Utilisateur non trouvé' });
        }
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        
        res.json({ msg: 'Mot de passe réinitialisé avec succès.' });
    } catch (error) {
        res.status(500).json({ msg: 'Erreur du serveur' });
    }
};


// -------------------------------------------------------------------
// Exportation des fonctions
// -------------------------------------------------------------------
module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    resetPassword,
};