import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import gradeService from '../services/gradeService';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { 
  Container, Typography, Box, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const MyResultsPage = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      gradeService.getMyResults(token)
        .then(response => {
          setResults(response.data);
        })
        .catch(err => {
          setError(err.response?.data?.msg || 'Une erreur est survenue.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Bulletin de Notes - ${results.studentName}`, 14, 20);
    doc.text(`Classe: ${results.className}`, 14, 30);

    const tableColumn = ["Matière", "Moyenne / 20"];
    const tableRows = results.gradesBySubject.map(g => 
      [g.subjectName, g.average !== null ? g.average.toFixed(2) : 'N/A']
    );

    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 40 });
    const finalY = doc.lastAutoTable.finalY || 50;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Moyenne Générale: ${results.overallAverage.toFixed(2)} / 20`, 14, finalY + 10);

    doc.save(`bulletin_${results.studentName.replace(' ', '_')}.pdf`);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h5" color="error" sx={{ mt: 4 }}>{error}</Typography>
        <Typography sx={{ mt: 2 }}>Veuillez contacter un administrateur pour lier votre compte à votre profil étudiant.</Typography>
      </Container>
    );
  }

  if (!results) {
    return (
      <Container>
        <Typography variant="h5" sx={{ mt: 4 }}>Aucun résultat trouvé pour le moment.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1">{results.studentName}</Typography>
          <Typography variant="h6" color="text.secondary">Classe : {results.className}</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadPDF}
        >
          Télécharger (PDF)
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Matière</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Moyenne / 20</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.gradesBySubject.map((grade, index) => (
              <TableRow key={index}>
                <TableCell>{grade.subjectName}</TableCell>
                <TableCell align="right">
                  {grade.average !== null ? grade.average.toFixed(2) : '—'}
                </TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ '& td, & th': { border: 0, fontWeight: 'bold' } }}>
              <TableCell component="th" scope="row">Moyenne Générale</TableCell>
              <TableCell align="right" sx={{ fontSize: '1.1rem', color: 'primary.main' }}>
                {results.overallAverage.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default MyResultsPage;