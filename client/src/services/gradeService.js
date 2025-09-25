import axios from 'axios';

const API_URL = 'http://localhost:5000/api/grades/';

// Ajouter une nouvelle note
const addGrade = (gradeData, token) => {
  return axios.post(API_URL, gradeData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Obtenir les résultats pour une classe
const getClassResults = (classId, token) => {
  return axios.get(`${API_URL}results/class/${classId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Vous pouvez ajouter d'autres fonctions ici si nécessaire
// const getGradesForStudent = (studentId, token) => { ... }

const gradeService = {
  addGrade,
  getClassResults,
};

export default gradeService;