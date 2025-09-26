import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import gradeService from '../services/gradeService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  Container, Typography, Box, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, CircularProgress,
  Button, IconButton, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const ClassResultsPage = () => {
  const { classId } = useParams();
  const { token } = useContext(AuthContext); // Utiliser le token du contexte
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token && classId) { // S'assurer que le token et l'ID existent
      gradeService.getDetailedClassResults(classId, token) // Passer le token
        .then(response => {
          setReport(response.data);
          setLoading(false);
        })
        .catch(error => {
          setMessage(error.response?.data?.msg || "Erreur de chargement du bulletin.");
          setLoading(false);
        });
    }
  }, [token, classId]);

  // ... (les fonctions handleDownloadIndividualPDF et handleDownloadGlobalPDF restent les mêmes)
  const handleDownloadIndividualPDF = (studentResult) => { /* ... */ };
  const handleDownloadGlobalPDF = () => { /* ... */ };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }
  // ... (le reste du JSX reste le même)
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          Bulletin : {report?.className}
        </Typography>
        <Box>
          <Button variant="outlined" startIcon={<EditIcon />} component={Link} to={`/class/${classId}/grades`} sx={{ mr: 2 }}>
            Saisir / Modifier les notes
          </Button>
          <Button variant="contained" startIcon={<PictureAsPdfIcon />} onClick={handleDownloadGlobalPDF} disabled={!report || report.results.length === 0}>
            Télécharger le Bilan Global (PDF)
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Nom de l'Étudiant</TableCell>
              {report?.allSubjects.map(subject => (
                <TableCell key={subject._id} align="center" sx={{ fontWeight: 'bold' }}>{subject.name}</TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Moyenne Générale</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Bulletin Individuel</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {report?.results.map(studentResult => (
              <TableRow key={studentResult.studentId} hover>
                <TableCell component="th" scope="row">{studentResult.studentName}</TableCell>
                {report.allSubjects.map(subject => {
                  const gradeInfo = studentResult.gradesBySubject.find(g => g.subjectId === subject._id);
                  return <TableCell key={subject._id} align="center">{gradeInfo ? gradeInfo.average.toFixed(2) : '—'}</TableCell>;
                })}
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{studentResult.overallAverage.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Télécharger le bulletin individuel">
                    <IconButton color="primary" onClick={() => handleDownloadIndividualPDF(studentResult)}>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ClassResultsPage;