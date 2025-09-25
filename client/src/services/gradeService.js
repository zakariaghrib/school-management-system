import axios from 'axios';

const API_URL = 'http://localhost:5000/api/grades/';

// Ajouter une nouvelle note
const addGrade = (gradeData, token) => {
  return axios.post(API_URL, gradeData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Obtenir les résultats simples (moyenne générale) pour une classe
const getClassResults = (classId, token) => {
  return axios.get(`${API_URL}results/class/${classId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// --- FONCTION MANQUANTE AJOUTÉE ICI ---
// Obtenir le bulletin de notes détaillé pour une classe
const getDetailedClassResults = (classId, token) => {
  return axios.get(`${API_URL}results/class/${classId}/detailed`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
// ------------------------------------

// Exporter toutes les fonctions
const gradeService = {
  addGrade,
  getClassResults,
  getDetailedClassResults, // Assurez-vous qu'elle est bien exportée ici
};

export default gradeService;