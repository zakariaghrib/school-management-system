import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import studentService from '../services/studentService';
import { AuthContext } from '../context/AuthContext';

const AddStudentPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [message, setMessage] = useState('');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await studentService.createStudent({ firstName, lastName, dateOfBirth }, user.token);
      navigate('/students');
    } catch (error) {
      const resMessage = error.response?.data?.msg || error.message || error.toString();
      setMessage(resMessage);
    }
  };

  return (
    <div>
      <h2>Ajouter un nouvel Étudiant</h2>
      <form onSubmit={handleCreate}>
        <div>
          <label>Prénom</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div>
          <label>Nom</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <div>
          <label>Date de Naissance</label>
          <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
        </div>
        <button type="submit">Créer</button>
      </form>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
};

export default AddStudentPage;