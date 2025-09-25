import axios from 'axios';

const API_URL = 'http://localhost:5000/api/subjects/';

// Obtenir toutes les matières
const getAllSubjects = (token) => {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Vous pouvez ajouter d'autres fonctions ici plus tard (create, update, delete)

const subjectService = {
  getAllSubjects,
};

export default subjectService;