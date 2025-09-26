import axios from 'axios';
const API_URL = 'http://localhost:5000/api/students/';

// Obtenir tous les étudiants (avec filtre optionnel par classe)
const getAllStudents = (token, classId = null) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {}
  };
  if (classId) {
    config.params.class = classId;
  }
  return axios.get(API_URL, config);
};

// Obtenir un étudiant par son ID
const getStudentById = (id, token) => {
  return axios.get(API_URL + id, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Créer un nouvel étudiant
const createStudent = (studentData, token) => {
  return axios.post(API_URL, studentData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Mettre à jour un étudiant
const updateStudent = (id, studentData, token) => {
  return axios.put(API_URL + id, studentData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Supprimer un étudiant
const deleteStudent = (id, token) => {
  return axios.delete(API_URL + id, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const studentService = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};

export default studentService;