import axios from 'axios';

const API_URL = 'http://localhost:5000/api/grades/';

const addGrade = (gradeData, token) => {
  return axios.post(API_URL, gradeData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getDetailedClassResults = (classId, token) => {
  return axios.get(`${API_URL}results/class/${classId}/detailed`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getGradesForClass = (classId, token) => {
  return axios.get(`${API_URL}class/${classId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const deleteGrade = (id, token) => {
  return axios.delete(API_URL + id, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const updateGrade = (id, gradeData, token) => {
    return axios.put(API_URL + id, gradeData, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

const gradeService = {
  addGrade,
  getDetailedClassResults,
  getGradesForClass,
  deleteGrade,
  updateGrade,
};

export default gradeService;