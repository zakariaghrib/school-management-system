import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// --- Pages Publiques ---
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

// --- Pages Protégées ---
import DashboardPage from './pages/DashboardPage.jsx';
import StudentListPage from './pages/StudentListPage.jsx';
import AddStudentPage from './pages/AddStudentPage.jsx';
import EditStudentPage from './pages/EditStudentPage.jsx';
import TeacherListPage from './pages/TeacherListPage.jsx';
import AddTeacherPage from './pages/AddTeacherPage.jsx';
import EditTeacherPage from './pages/EditTeacherPage.jsx';
import ClassListPage from './pages/ClassListPage.jsx';
import AddClassPage from './pages/AddClassPage.jsx';
import EditClassPage from './pages/EditClassPage.jsx';
import ClassGradesPage from './pages/ClassGradesPage.jsx';
import ClassResultsPage from './pages/ClassResultsPage.jsx';
import ResultsHubPage from './pages/ResultsHubPage.jsx';
import GradeEntryHubPage from './pages/GradeEntryHubPage.jsx';
import SubjectListPage from './pages/SubjectListPage.jsx';
import UserListPage from './pages/UserListPage.jsx';           // Import de HEAD
import MyResultsPage from './pages/MyResultsPage.jsx';         // Import de 2770df0
import StudentGradesPage from './pages/StudentGradesPage.jsx'; // Import de 2770df0

function App() {
  return (
    <>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <Routes>
          {/* --- Routes Publiques --- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* --- Routes Protégées (Nécessitent la connexion) --- */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          
          {/* Gestion des Utilisateurs (Admin) */}
          <Route path="/users" element={<ProtectedRoute><UserListPage /></ProtectedRoute>} />

          {/* Gestion des Étudiants */}
          <Route path="/students" element={<ProtectedRoute><StudentListPage /></ProtectedRoute>} />
          <Route path="/students/add" element={<ProtectedRoute><AddStudentPage /></ProtectedRoute>} />
          <Route path="/students/edit/:id" element={<ProtectedRoute><EditStudentPage /></ProtectedRoute>} />
          
          {/* Gestion des Enseignants */}
          <Route path="/teachers" element={<ProtectedRoute><TeacherListPage /></ProtectedRoute>} />
          <Route path="/teachers/add" element={<ProtectedRoute><AddTeacherPage /></ProtectedRoute>} />
          <Route path="/teachers/edit/:id" element={<ProtectedRoute><EditTeacherPage /></ProtectedRoute>} />

          {/* Gestion des Classes et Matières */}
          <Route path="/classes" element={<ProtectedRoute><ClassListPage /></ProtectedRoute>} />
          <Route path="/classes/add" element={<ProtectedRoute><AddClassPage /></ProtectedRoute>} />
          <Route path="/classes/edit/:id" element={<ProtectedRoute><EditClassPage /></ProtectedRoute>} />
          <Route path="/subjects" element={<ProtectedRoute><SubjectListPage /></ProtectedRoute>} />
          
          {/* Notes et Résultats */}
          <Route path="/grades/entry" element={<ProtectedRoute><GradeEntryHubPage /></ProtectedRoute>} />
          <Route path="/class/:classId/grades" element={<ProtectedRoute><ClassGradesPage /></ProtectedRoute>} />
          
          {/* Affichage des Résultats */}
          <Route path="/results" element={<ProtectedRoute><ResultsHubPage /></ProtectedRoute>} />
          <Route path="/classes/:classId/results" element={<ProtectedRoute><ClassResultsPage /></ProtectedRoute>} />
          
          {/* Routes de la version 2770df0 */}
          <Route path="/my-results" element={<ProtectedRoute><MyResultsPage /></ProtectedRoute>} />
          <Route path="/students/:studentId/grades" element={<ProtectedRoute><StudentGradesPage /></ProtectedRoute>} />
          
          {/* --- Redirection par défaut --- */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;