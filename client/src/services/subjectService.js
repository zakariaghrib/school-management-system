import axios from 'axios';

const API_URL = 'http://localhost:5000/api/subjects/';

// Obtenir toutes les matières
const getAllSubjects = (token) => {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Créer une nouvelle matière
const createSubject = (subjectData, token) => {
  return axios.post(API_URL, subjectData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Supprimer une matière
const deleteSubject = (id, token) => {
  return axios.delete(API_URL + id, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const subjectService = {
  getAllSubjects,
  createSubject,
  deleteSubject,
};

export default subjectService;