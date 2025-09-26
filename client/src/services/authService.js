import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users/';

const register = (userData) => {
  return axios.post(API_URL + 'register', userData);
};

// La fonction login attend 'email' et 'password'
const login = (email, password) => {
  return axios.post(API_URL + 'login', { email, password });
};

const authService = {
  register,
  login,
};

export default authService;
