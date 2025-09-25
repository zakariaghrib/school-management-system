import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- Importation des Composants de Base ---
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// --- Importation des Pages Publiques ---
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

// --- Importation des Pages Protégées ---
import DashboardPage from './pages/DashboardPage.jsx';
import StudentListPage from './pages/StudentListPage.jsx';
import AddStudentPage from './pages/AddStudentPage.jsx';
import TeacherListPage from './pages/TeacherListPage.jsx';
import AddTeacherPage from './pages/AddTeacherPage.jsx';
import EditTeacherPage from './pages/EditTeacherPage.jsx';
import ClassListPage from './pages/ClassListPage.jsx';
import AddClassPage from './pages/AddClassPage.jsx';


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
          
          {/* Routes pour la Gestion des Étudiants */}
          <Route 
            path="/students" 
            element={<ProtectedRoute><StudentListPage /></ProtectedRoute>} 
          />
          <Route 
            path="/students/add" 
            element={<ProtectedRoute><AddStudentPage /></ProtectedRoute>} 
          />
          
          {/* Routes pour la Gestion des Enseignants */}
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

          {/* Routes pour la Gestion des Classes */}
          <Route 
            path="/classes" 
            element={<ProtectedRoute><ClassListPage /></ProtectedRoute>} 
          />
          <Route 
            path="/classes/add" 
            element={<ProtectedRoute><AddClassPage /></ProtectedRoute>} 
          />

          {/* --- Redirection par défaut --- */}
          {/* Redirige toute URL inconnue vers le tableau de bord */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;