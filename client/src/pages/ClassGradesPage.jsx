import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import studentService from '../services/studentService';
import subjectService from '../services/subjectService';
import gradeService from '../services/gradeService';
import {
  Container, Typography, Box, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, CircularProgress,
  Button, TextField, Alert
} from '@mui/material';

const ClassGradesPage = () => {
  const { classId } = useParams();
  const { token, user } = useContext(AuthContext); // **1. Récupérer le token et l'utilisateur**

  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Transformer les notes existantes en un format facile à utiliser: { studentId: { subjectId: { gradeId, gradeValue } } }
  const mapExistingGrades = (existingGradesData) => {
    const mappedGrades = {};
    existingGradesData.forEach(grade => {
      const studentId = grade.student._id;
      const subjectId = grade.subject._id;
      if (!mappedGrades[studentId]) {
        mappedGrades[studentId] = {};
      }
      // On ne garde que la première note trouvée pour un couple étudiant/matière pour simplifier l'affichage
      if (!mappedGrades[studentId][subjectId]) {
        mappedGrades[studentId][subjectId] = { gradeId: grade._id, gradeValue: grade.grade };
      }
    });
    return mappedGrades;
  };

  useEffect(() => {
    // **2. Vérifier que le token existe avant de faire les appels**
    if (token) {
      setLoading(true);
      setError('');
      Promise.all([
        studentService.getAllStudents(token, classId),
        subjectService.getAllSubjects(token),
        gradeService.getGradesForClass(classId, token)
      ]).then(([studentsRes, subjectsRes, gradesRes]) => {
        setStudents(studentsRes.data);
        setSubjects(subjectsRes.data);
        setGrades(mapExistingGrades(gradesRes.data));
      }).catch(err => {
        console.error("Erreur de chargement des données:", err);
        setError("Erreur de chargement des données. L'authentification a peut-être échoué.");
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [classId, token]); // **3. Ajouter token aux dépendances**

  const handleGradeChange = (studentId, subjectId, value) => {
    const gradeValue = value === '' ? null : parseInt(value, 10);
    // Permettre la suppression et limiter les notes entre 0 et 20
    if (gradeValue === null || (gradeValue >= 0 && gradeValue <= 20)) {
      setGrades(prev => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [subjectId]: {
            ...prev[studentId]?.[subjectId], // Garder gradeId s'il existe
            gradeValue: gradeValue,
          }
        }
      }));
    }
  };

  const handleSaveGrades = async () => {
    setMessage('Sauvegarde en cours...');
    setError('');
    const promises = [];

    for (const studentId of Object.keys(grades)) {
      for (const subjectId of Object.keys(grades[studentId])) {
        const gradeInfo = grades[studentId][subjectId];
        if (gradeInfo.gradeValue !== null) {
          const gradeData = {
            student: studentId,
            subject: subjectId,
            grade: gradeInfo.gradeValue,
            examType: 'Contrôle 1', // À dynamiser si besoin
            teacher: user.id, // Assurez-vous que votre token contient l'ID de l'utilisateur
          };
          if (gradeInfo.gradeId) {
            // Mettre à jour la note existante
            promises.push(gradeService.updateGrade(gradeInfo.gradeId, { grade: gradeInfo.gradeValue }, token));
          } else {
            // Créer une nouvelle note
            promises.push(gradeService.addGrade(gradeData, token));
          }
        }
      }
    }

    try {
      await Promise.all(promises);
      setMessage('Notes sauvegardées avec succès !');
    } catch (err) {
      setError('Une erreur est survenue lors de la sauvegarde.');
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth={false}>
      <Typography variant="h4" sx={{ my: 4 }}>Saisie des Notes</Typography>
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 170 }}>Étudiant</TableCell>
              {subjects.map(subject => (
                <TableCell key={subject._id} align="center" sx={{ fontWeight: 'bold', minWidth: 120 }}>
                  {subject.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map(student => (
              <TableRow key={student._id} hover>
                <TableCell component="th" scope="row">
                  {student.firstName} {student.lastName}
                </TableCell>
                {subjects.map(subject => (
                  <TableCell key={subject._id} align="center">
                    <TextField
                      type="number"
                      size="small"
                      inputProps={{ min: 0, max: 20, style: { textAlign: 'center' } }}
                      value={grades[student._id]?.[subject._id]?.gradeValue ?? ''}
                      onChange={(e) => handleGradeChange(student._id, subject._id, e.target.value)}
                      sx={{ width: '80px' }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={handleSaveGrades}>
          Sauvegarder les Notes
        </Button>
      </Box>
    </Container>
  );
};

export default ClassGradesPage;