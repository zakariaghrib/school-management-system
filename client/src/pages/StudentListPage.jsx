import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import studentService from '../services/studentService';
import { AuthContext } from '../context/AuthContext';

const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.token) {
      studentService.getAllStudents(user.token)
        .then(response => {
          setStudents(response.data);
        })
        .catch(error => {
          const resMessage = error.response?.data?.msg || error.message || error.toString();
          setMessage(resMessage);
        });
    }
  }, [user]);

  return (
    <div>
      <h2>Liste des Étudiants</h2>
      <Link to="/students/add">Ajouter un Étudiant</Link>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <table border="1" style={{ width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Date de Naissance</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student._id}>
              <td>{student.firstName}</td>
              <td>{student.lastName}</td>
              <td>{new Date(student.dateOfBirth).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentListPage;