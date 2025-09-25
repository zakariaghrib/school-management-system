import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users/';

const register = (userData) => {
  return axios.post(API_URL + 'register', userData);
};

const login = (userData) => {
  return axios.post(API_URL + 'login', userData);
};

const authService = {
  register,
  login,
};

export default authService;