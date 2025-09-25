import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import teacherService from '../services/teacherService';
import { AuthContext } from '../context/AuthContext';

const AddTeacherPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    const teacherData = { firstName, lastName, contact: { email } };
    try {
      await teacherService.createTeacher(teacherData, user.token);
      navigate('/teachers');
    } catch (error) {
      setMessage(error.response?.data?.msg || "Erreur");
    }
  };

  return (
    <div>
      <h2>Ajouter un nouvel Enseignant</h2>
      <form onSubmit={handleCreate}>
        <div><label>Prénom</label><input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required /></div>
        <div><label>Nom</label><input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required /></div>
        <div><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
        <button type="submit">Créer</button>
      </form>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
};

export default AddTeacherPage;