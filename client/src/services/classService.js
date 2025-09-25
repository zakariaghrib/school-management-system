import axios from 'axios';

const API_URL = 'http://localhost:5000/api/classes/';

// Obtenir toutes les classes
const getAllClasses = (token) => {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Obtenir une classe par son ID
const getClassById = (id, token) => {
  return axios.get(API_URL + id, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Créer une nouvelle classe
const createClass = (classData, token) => {
  return axios.post(API_URL, classData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Mettre à jour une classe
const updateClass = (id, classData, token) => {
  return axios.put(API_URL + id, classData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Supprimer une classe
const deleteClass = (id, token) => {
  return axios.delete(API_URL + id, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const classService = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
};

export default classService;