import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import classService from '../services/classService';
import teacherService from '../services/teacherService'; // On a besoin des profs
import { AuthContext } from '../context/AuthContext';

const AddClassPage = () => {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [mainTeacher, setMainTeacher] = useState('');
  const [teachers, setTeachers] = useState([]); // Pour le menu déroulant
  const [message, setMessage] = useState('');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Charger la liste des enseignants au montage du composant
  useEffect(() => {
    teacherService.getAllTeachers(user.token)
      .then(response => setTeachers(response.data))
      .catch(() => setMessage("Erreur de chargement des enseignants."));
  }, [user.token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await classService.createClass({ name, year, mainTeacher }, user.token);
      navigate('/classes');
    } catch (error) {
      setMessage(error.response?.data?.msg || "Erreur lors de la création.");
    }
  };

  return (
    <div>
      <h2>Ajouter une nouvelle Classe</h2>
      <form onSubmit={handleCreate}>
        <div>
          <label>Nom de la classe (ex: 6ème A)</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label>Année scolaire (ex: 2025-2026)</label>
          <input type="text" value={year} onChange={e => setYear(e.target.value)} required />
        </div>
        <div>
          <label>Professeur Principal</label>
          <select value={mainTeacher} onChange={e => setMainTeacher(e.target.value)}>
            <option value="">-- Sélectionnez un enseignant --</option>
            {teachers.map(teacher => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.firstName} {teacher.lastName}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Créer la Classe</button>
      </form>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
};

export default AddClassPage;