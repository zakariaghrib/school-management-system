import axios from 'axios';

const API_URL = 'http://localhost:5000/api/subjects/';

const getAllSubjects = (token) => {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const createSubject = (subjectData, token) => {
  return axios.post(API_URL, subjectData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const deleteSubject = (id, token) => {
  return axios.delete(API_URL + id, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const subjectService = {
  getAllSubjects,
  createSubject,
  deleteSubject,
};

export default subjectService;