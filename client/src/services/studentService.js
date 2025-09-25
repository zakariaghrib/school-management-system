import axios from 'axios';

const API_URL = 'http://localhost:5000/api/students/';

// Obtenir tous les étudiants
const getAllStudents = (token) => {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Créer un nouvel étudiant
const createStudent = (studentData, token) => {
  return axios.post(API_URL, studentData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const studentService = {
  getAllStudents,
  createStudent,
};

export default studentService;