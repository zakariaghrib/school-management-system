import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import subjectService from '../services/subjectService';
import classService from '../services/classService';
import gradeService from '../services/gradeService';

const ClassGradesPage = () => {
  const { classId } = useParams();
  const { user } = useContext(AuthContext);
  
  const [classInfo, setClassInfo] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState('');

  // États du formulaire
  const [student, setStudent] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [examType, setExamType] = useState('Contrôle 1');

  useEffect(() => {
    if (user && user.token) {
      // Charger les infos de la classe (qui inclut les étudiants)
      classService.getClassById(classId, user.token).then(res => setClassInfo(res.data));
      // Charger la liste des matières
      subjectService.getAllSubjects(user.token).then(res => setSubjects(res.data));
    }
  }, [classId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const gradeData = { student, subject, grade, examType, teacher: user.id };
    try {
      await gradeService.addGrade(gradeData, user.token);
      setMessage(`Note ${grade}/20 ajoutée avec succès !`);
      // Vider le formulaire
      setStudent(''); setSubject(''); setGrade('');
    } catch (error) {
      setMessage(error.response?.data?.msg || "Erreur lors de l'ajout de la note.");
    }
  };

  if (!classInfo) return <p>Chargement des informations de la classe...</p>;

  return (
    <div>
      <h2>Gérer les Notes pour la Classe : {classInfo.name}</h2>
      <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '1rem' }}>
        <h4>Ajouter une note</h4>
        <div style={{ marginBottom: '1rem' }}>
          <label>Étudiant : </label>
          <select value={student} onChange={e => setStudent(e.target.value)} required>
            <option value="">-- Sélectionnez un étudiant --</option>
            {classInfo.students.map(s => <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Matière : </label>
          <select value={subject} onChange={e => setSubject(e.target.value)} required>
            <option value="">-- Sélectionnez une matière --</option>
            {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Type d'examen : </label>
          <input type="text" placeholder="Ex: Devoir Surveillé 1" value={examType} onChange={e => setExamType(e.target.value)} required/>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Note / 20 : </label>
          <input type="number" step="0.5" min="0" max="20" placeholder="15.5" value={grade} onChange={e => setGrade(e.target.value)} required/>
        </div>
        <button type="submit">Ajouter la Note</button>
      </form>
      {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
    </div>
  );
};

export default ClassGradesPage;