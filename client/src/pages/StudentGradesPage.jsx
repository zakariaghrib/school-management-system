import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import gradeService from '../services/gradeService';
import studentService from '../services/studentService';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  Container, Typography, Box, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, CircularProgress,
  Button, Alert
} from '@mui/material';
import { FaUserGraduate } from 'react-icons/fa';
import DownloadIcon from '@mui/icons-material/Download';
import { motion } from 'framer-motion';

const StudentGradesPage = () => {
  const { studentId } = useParams();
  const [grades, setGrades] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token && studentId) {
      setLoading(true);
      Promise.all([
        gradeService.getGradesForStudent(studentId, token),
        studentService.getStudentById(studentId, token)
      ]).then(([gradesRes, studentRes]) => {
        setGrades(gradesRes.data);
        setStudent(studentRes.data);
      }).catch(err => {
        setError("Erreur de chargement des données.");
      }).finally(() => setLoading(false));
    }
  }, [token, studentId]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Relevé de Notes Détaillé - ${student.firstName} ${student.lastName}`, 14, 20);
    
    const tableColumn = ["Matière", "Type d'Examen", "Note / 20"];
    const tableRows = grades.map(g => [g.subject.name, g.examType, g.grade]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save(`releve_notes_${student.lastName}.pdf`);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }
  
  if (error) {
    return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FaUserGraduate className="text-4xl text-gray-600 mr-3" />
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Relevé de Notes Détaillé
            </Typography>
            {student && (
              <Typography color="text.secondary">
                Étudiant : {student.firstName} {student.lastName}
              </Typography>
            )}
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadPDF}
          disabled={grades.length === 0}
        >
          Télécharger (PDF)
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Matière</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Type d'Examen</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Note / 20</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grades.length > 0 ? (
                grades.map((grade, index) => (
                  <motion.tr
                    key={grade._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    style={{ display: 'table-row' }}
                  >
                    <TableCell>{grade.subject?.name || 'N/A'}</TableCell>
                    <TableCell>{grade.examType}</TableCell>
                    <TableCell>{new Date(grade.date || Date.now()).toLocaleDateString()}</TableCell>
                    <TableCell align="right">{grade.grade}</TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">Aucune note trouvée pour cet étudiant.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default StudentGradesPage;