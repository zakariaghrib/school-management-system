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

const classService = {
  getAllClasses,
  createClass,
};

export default classService;