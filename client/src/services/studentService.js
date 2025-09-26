import axios from 'axios';
const API_URL = 'http://localhost:5000/api/students/';

const getAllStudents = (token, classId) => {
  let url = API_URL;
  if (classId) {
    url += `?classId=${classId}`;
  }
  return axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
};
const getStudentById = (id, token) => {
  return axios.get(API_URL + id, { headers: { Authorization: `Bearer ${token}` } });
};
const createStudent = (studentData, token) => {
  return axios.post(API_URL, studentData, { headers: { Authorization: `Bearer ${token}` } });
};
const updateStudent = (id, studentData, token) => {
  return axios.put(API_URL + id, studentData, { headers: { Authorization: `Bearer ${token}` } });
};
const deleteStudent = (id, token) => {
  return axios.delete(API_URL + id, { headers: { Authorization: `Bearer ${token}` } });
};

const studentService = { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent };
export default studentService;