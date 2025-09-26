import axios from 'axios';
const API_URL = 'http://localhost:5000/api/users/';

const getAllUsers = (token) => {
  return axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
};
const resetPassword = (userId, password, token) => {
  return axios.put(`${API_URL}reset-password/${userId}`, { password }, { headers: { Authorization: `Bearer ${token}` } });
};

const userService = { getAllUsers, resetPassword };
export default userService;