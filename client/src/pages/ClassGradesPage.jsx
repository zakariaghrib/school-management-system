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
import { FaClipboardList } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ClassGradesPage = () => {
  const { classId } = useParams();
  const { token, user } = useContext(AuthContext);

  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const mapExistingGrades = (existingGradesData) => {
    const mappedGrades = {};
    existingGradesData.forEach(grade => {
      const studentId = grade.student._id;
      const subjectId = grade.subject._id;
      if (!mappedGrades[studentId]) mappedGrades[studentId] = {};
      if (!mappedGrades[studentId][subjectId]) {
        mappedGrades[studentId][subjectId] = { gradeId: grade._id, gradeValue: grade.grade };
      }
    });
    return mappedGrades;
  };

  useEffect(() => {
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
        setError("Erreur de chargement des données.");
      }).finally(() => setLoading(false));
    }
  }, [classId, token]);

  const handleGradeChange = (studentId, subjectId, value) => {
    const gradeValue = value === '' ? null : parseInt(value, 10);
    if (gradeValue === null || (gradeValue >= 0 && gradeValue <= 20)) {
      setGrades(prev => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [subjectId]: { ...prev[studentId]?.[subjectId], gradeValue: gradeValue },
        }
      }));
    }
  };

  const handleSaveGrades = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    const promises = [];

    for (const studentId of Object.keys(grades)) {
      for (const subjectId of Object.keys(grades[studentId])) {
        const gradeInfo = grades[studentId][subjectId];
        if (gradeInfo.gradeValue !== null) {
          const gradeData = { student: studentId, subject: subjectId, grade: gradeInfo.gradeValue, examType: 'Contrôle', teacher: user.id };
          if (gradeInfo.gradeId) {
            promises.push(gradeService.updateGrade(gradeInfo.gradeId, { grade: gradeInfo.gradeValue }, token));
          } else {
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
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <FaClipboardList className="text-4xl text-gray-600 mr-3" />
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Saisie des Notes
          </Typography>
          <Typography color="text.secondary">
            Modifiez les notes des étudiants pour la classe sélectionnée.
          </Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : (
        <Paper sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 170, bgcolor: 'grey.100' }}>Étudiant</TableCell>
                  {subjects.map(subject => (
                    <TableCell key={subject._id} align="center" sx={{ fontWeight: 'bold', minWidth: 120, bgcolor: 'grey.100' }}>
                      {subject.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, index) => (
                  <motion.tr
                    key={student._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    style={{ display: 'table-row' }}
                  >
                    <TableCell component="th" scope="row">{student.firstName} {student.lastName}</TableCell>
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
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      
      {!loading && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveGrades}
            disabled={saving}
          >
            {saving ? <CircularProgress size={24} color="inherit" /> : 'Sauvegarder les Notes'}
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default ClassGradesPage;