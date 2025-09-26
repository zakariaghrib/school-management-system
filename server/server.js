const express = require('express');
const cors = require('cors'); // Importer le paquet cors
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

// Importer toutes les routes
const userRoutes = require('./routes/userRoutes.js');
const studentRoutes = require('./routes/studentRoutes.js');
const teacherRoutes = require('./routes/teacherRoutes.js');
const classRoutes = require('./routes/classRoutes.js');
const subjectRoutes = require('./routes/subjectRoutes.js');
const gradeRoutes = require('./routes/gradeRoutes.js');

dotenv.config();
connectDB();

const app = express();

// --- CONFIGURATION CORS AJOUTÉE ICI ---
// Doit être placée avant les routes
app.use(cors({
  origin: 'http://localhost:3000' // Autorise uniquement votre client React
}));
// ------------------------------------

// Middleware pour parser le JSON
app.use(express.json());

// Monter les routes
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/grades', gradeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
