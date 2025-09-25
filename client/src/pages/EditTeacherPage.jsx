import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import teacherService from '../services/teacherService';
import { AuthContext } from '../context/AuthContext';

const EditTeacherPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams(); // Récupère l'ID de l'enseignant depuis l'URL

  useEffect(() => {
    teacherService.getTeacherById(id, user.token)
      .then(response => {
        const teacher = response.data;
        setFirstName(teacher.firstName);
        setLastName(teacher.lastName);
        setEmail(teacher.contact.email);
      })
      .catch(error => setMessage(error.response?.data?.msg || "Erreur"));
  }, [id, user.token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const teacherData = { firstName, lastName, contact: { email } };
    try {
      await teacherService.updateTeacher(id, teacherData, user.token);
      navigate('/teachers');
    } catch (error) {
      setMessage(error.response?.data?.msg || "Erreur");
    }
  };

  return (
    <div>
      <h2>Modifier l'Enseignant</h2>
      <form onSubmit={handleUpdate}>
        <div><label>Prénom</label><input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required /></div>
        <div><label>Nom</label><input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required /></div>
        <div><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
        <button type="submit">Mettre à jour</button>
      </form>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
};

export default EditTeacherPage;