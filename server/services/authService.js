// client/src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users/';

// Inscrire un utilisateur
const register = (userData) => {
  return axios.post(API_URL + 'register', userData);
};

// Connecter un utilisateur
const login = (userData) => {
  return axios.post(API_URL + 'login', userData);
};

const authService = {
  register,
  login,
};

export default authService;