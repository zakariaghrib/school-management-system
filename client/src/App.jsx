import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- Composants de Base ---
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
import UserListPage from './pages/UserListPage.jsx';

function App() {
  return (
    <>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <Routes>
          {/* --- Routes Publiques --- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* --- Routes Protégées --- */}
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} 
          />
          
          {/* Routes pour les Étudiants */}
          <Route 
            path="/students" 
            element={<ProtectedRoute><StudentListPage /></ProtectedRoute>} 
          />
          <Route 
            path="/students/add" 
            element={<ProtectedRoute><AddStudentPage /></ProtectedRoute>} 
          />
          <Route 
            path="/students/edit/:id" 
            element={<ProtectedRoute><EditStudentPage /></ProtectedRoute>} 
          />
          
          {/* Routes pour les Enseignants */}
          <Route 
            path="/teachers" 
            element={<ProtectedRoute><TeacherListPage /></ProtectedRoute>} 
          />
          <Route 
            path="/teachers/add" 
            element={<ProtectedRoute><AddTeacherPage /></ProtectedRoute>} 
          />
          <Route 
            path="/teachers/edit/:id" 
            element={<ProtectedRoute><EditTeacherPage /></ProtectedRoute>} 
          />

          {/* Routes pour les Classes */}
          <Route 
            path="/classes" 
            element={<ProtectedRoute><ClassListPage /></ProtectedRoute>} 
          />
          <Route 
            path="/classes/add" 
            element={<ProtectedRoute><AddClassPage /></ProtectedRoute>} 
          />
          <Route 
            path="/classes/edit/:id" 
            element={<ProtectedRoute><EditClassPage /></ProtectedRoute>} 
          />
          
          {/* Routes pour les Notes et Résultats */}
          <Route 
            path="/class/:classId/grades" 
            element={<ProtectedRoute><ClassGradesPage /></ProtectedRoute>} 
          />
          <Route 
            path="/classes/:classId/results" 
            element={<ProtectedRoute><ClassResultsPage /></ProtectedRoute>} 
          />
          <Route 
            path="/results" 
            element={<ProtectedRoute><ResultsHubPage /></ProtectedRoute>} 
          />
          <Route 
            path="/grades/entry" 
            element={<ProtectedRoute><GradeEntryHubPage /></ProtectedRoute>} 
          />

          {/* Route pour les Matières */}
          <Route 
            path="/subjects" 
            element={<ProtectedRoute><SubjectListPage /></ProtectedRoute>} 
          />

          {/* Route pour les Utilisateurs (Admin) */}
          <Route 
            path="/users" 
            element={<ProtectedRoute><UserListPage /></ProtectedRoute>} 
          />

          {/* --- Redirection par défaut --- */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

