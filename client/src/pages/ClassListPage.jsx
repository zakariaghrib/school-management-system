import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import classService from '../services/classService';
import { AuthContext } from '../context/AuthContext';

const ClassListPage = () => {
  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.token) {
      classService.getAllClasses(user.token)
        .then(response => {
          setClasses(response.data);
        })
        .catch(error => {
          setMessage(error.response?.data?.msg || "Erreur de chargement des classes.");
        });
    }
  }, [user]);

  return (
    <div>
      <h2>Gestion des Classes</h2>
      <Link to="/classes/add">Ajouter une Classe</Link>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <table border="1" style={{ width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Nom de la Classe</th>
            <th>Année</th>
            <th>Professeur Principal</th>
            <th>Nombre d'étudiants</th>
          </tr>
        </thead>
        <tbody>
          {classes.map(cls => (
            <tr key={cls._id}>
              <td>{cls.name}</td>
              <td>{cls.year}</td>
              <td>{cls.mainTeacher ? `${cls.mainTeacher.firstName} ${cls.mainTeacher.lastName}` : 'Non assigné'}</td>
              <td>{cls.students.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassListPage;