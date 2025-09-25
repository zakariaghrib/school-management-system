import axios from 'axios';

const API_URL = 'http://localhost:5000/api/teachers/';

const getAllTeachers = (token) => {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const createTeacher = (teacherData, token) => {
  return axios.post(API_URL, teacherData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// --- Nouvelles fonctionnalités ---
const getTeacherById = (id, token) => {
  return axios.get(API_URL + id, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const updateTeacher = (id, teacherData, token) => {
  return axios.put(API_URL + id, teacherData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const deleteTeacher = (id, token) => {
  return axios.delete(API_URL + id, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


const teacherService = {
  getAllTeachers,
  createTeacher,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};

export default teacherService;