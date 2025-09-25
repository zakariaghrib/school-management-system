import axios from 'axios';

const API_URL = 'http://localhost:5000/api/classes/';

// Obtenir toutes les classes
const getAllClasses = (token) => {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Créer une nouvelle classe
const createClass = (classData, token) => {
  return axios.post(API_URL, classData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// --- FONCTION MANQUANTE AJOUTÉE ICI ---
// Obtenir une classe par son ID
const getClassById = (id, token) => {
  return axios.get(API_URL + id, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
// ------------------------------------

const classService = {
  getAllClasses,
  createClass,
  getClassById, // <-- Assurez-vous qu'elle est exportée
};

export default classService;
