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
          setMessage(error.response?.data?.msg || "Error loading classes.");
        });
    }
  }, [user]);

  return (
    <div>
      <h2>Class Management</h2>
      <Link to="/classes/add">Add a Class</Link>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <table border="1" style={{ width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Year</th>
            <th>Main Teacher</th>
            <th>Number of Students</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map(cls => (
            <tr key={cls._id}>
              <td>{cls.name}</td>
              <td>{cls.year}</td>
              <td>{cls.mainTeacher ? `${cls.mainTeacher.firstName} ${cls.mainTeacher.lastName}` : 'Not assigned'}</td>
              <td>{cls.students.length}</td>
              <td>
                <Link to={`/classes/${cls._id}/results`}>View Results</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassListPage;