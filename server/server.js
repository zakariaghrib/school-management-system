// server/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

// Importation de toutes les routes
const userRoutes = require('./routes/userRoutes.js');
const studentRoutes = require('./routes/studentRoutes.js');
const teacherRoutes = require('./routes/teacherRoutes.js');
const classRoutes = require('./routes/classRoutes.js');
const subjectRoutes = require('./routes/subjectRoutes.js');
const gradeRoutes = require('./routes/gradeRoutes.js');

dotenv.config();
connectDB();

const app = express();

// --- Configuration de CORS ---
// Doit être placé avant les routes
const corsOptions = {
  origin: 'http://localhost:3000', // Autorise uniquement votre client React
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware pour parser le JSON
app.use(express.json());

// --- Monter les routes sur leurs URLs respectives ---
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/grades', gradeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Le serveur écoute sur le port ${PORT}`);
});