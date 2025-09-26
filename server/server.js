const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();

// Middleware pour autoriser le Cross-Origin Resource Sharing (CORS)
// 'origin: http://localhost:3000' est une bonne pratique pour n'autoriser que votre client.
app.use(cors({
    origin: 'http://localhost:3000' // Autorise uniquement votre client React/Vite
}));

// Middleware pour parser le JSON des requêtes (doit être placé avant les routes)
app.use(express.json());

// ---------------------------------------------------------------------
// IMPORTATION DES ROUTES
// J'ai pris la liste d'importation de HEAD et l'utilisation de 2770df0
// La liste est centralisée ici pour la lisibilité
// ---------------------------------------------------------------------

// Importations des fichiers de routes (CommonJS syntaxe)
const userRoutes = require('./routes/userRoutes.js');
const studentRoutes = require('./routes/studentRoutes.js');
const teacherRoutes = require('./routes/teacherRoutes.js');
const classRoutes = require('./routes/classRoutes.js');
const subjectRoutes = require('./routes/subjectRoutes.js');
const gradeRoutes = require('./routes/gradeRoutes.js');


// Route de test (optionnelle, mais utile pour vérifier que le serveur est démarré)
app.get('/', (req, res) => res.send('API is running...'));


// Monter les routes sur l'application
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/grades', gradeRoutes);


// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
