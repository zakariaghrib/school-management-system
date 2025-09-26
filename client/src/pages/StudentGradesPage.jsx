import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import gradeService from '../services/gradeService';
import studentService from '../services/studentService';
import { 
  Container, Typography, Box, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, CircularProgress 
} from '@mui/material';

const StudentGradesPage = () => {
  const { studentId } = useParams();
  const [grades, setGrades] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token && studentId) {
      Promise.all([
        gradeService.getGradesForStudent(studentId, token),
        studentService.getStudentById(studentId, token)
      ]).then(([gradesRes, studentRes]) => {
        setGrades(gradesRes.data);
        setStudent(studentRes.data);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [token, studentId]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1">
          Relevé de Notes Détaillé
        </Typography>
        {student && (
          <Typography variant="h6" color="text.secondary">
            Étudiant : {student.firstName} {student.lastName}
          </Typography>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Matière</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Type d'Examen</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Note / 20</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grades.length > 0 ? grades.map(grade => (
              <TableRow key={grade._id} hover>
                <TableCell>{grade.subject?.name || 'N/A'}</TableCell>
                <TableCell>{grade.examType}</TableCell>
                <TableCell align="right">{grade.grade}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={3} align="center">Aucune note trouvée pour cet étudiant.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default StudentGradesPage;