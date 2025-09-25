import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import teacherService from '../services/teacherService';
import { AuthContext } from '../context/AuthContext';

const TeacherListPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);

  const loadTeachers = () => {
    if (user && user.token) {
      teacherService.getAllTeachers(user.token)
        .then(response => setTeachers(response.data))
        .catch(error => setMessage(error.response?.data?.msg || "Erreur"));
    }
  };

  useEffect(() => {
    loadTeachers();
  }, [user]);

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
      teacherService.deleteTeacher(id, user.token)
        .then(() => loadTeachers()) // Recharger la liste après suppression
        .catch(error => setMessage(error.response?.data?.msg || "Erreur"));
    }
  };

  return (
    <div>
      <h2>Gestion des Enseignants</h2>
      <Link to="/teachers/add">Ajouter un Enseignant</Link>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <table border="1" style={{ width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map(teacher => (
            <tr key={teacher._id}>
              <td>{teacher.firstName}</td>
              <td>{teacher.lastName}</td>
              <td>{teacher.contact.email}</td>
              <td>
                <Link to={`/teachers/edit/${teacher._id}`}>Modifier</Link> |{' '}
                <button onClick={() => handleDelete(teacher._id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherListPage;