import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import gradeService from '../services/gradeService';

// --- IMPORTATIONS PDF CORRIGÉES ---
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Importation corrigée
// ------------------------------------

// Importations MUI
import { 
  Container, Typography, Box, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, CircularProgress,
  Button, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';

const ClassResultsPage = () => {
  const { classId } = useParams();
  const { user } = useContext(AuthContext);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && classId) {
      gradeService.getDetailedClassResults(classId, user.token)
        .then(response => {
          setReport(response.data);
          setLoading(false);
        })
        .catch(error => {
          setMessage(error.response?.data?.msg || "Erreur de chargement du bulletin.");
          setLoading(false);
        });
    }
  }, [user, classId]);

  const handleDownloadPDF = (studentResult) => {
    const doc = new jsPDF();

    doc.text(`Bulletin de Notes - ${studentResult.studentName}`, 14, 20);
    doc.text(`Classe: ${report?.className}`, 14, 30);

    const tableColumn = ["Matière", "Note / 20"];
    const tableRows = [];

    report?.allSubjects.forEach(subject => {
      const gradeInfo = studentResult.gradesBySubject.find(g => g.subjectId === subject._id);
      const rowData = [
        subject.name,
        gradeInfo ? gradeInfo.average.toFixed(2) : 'N/A'
      ];
      tableRows.push(rowData);
    });

    // --- UTILISATION CORRIGÉE DE AUTOTABLE ---
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
    });
    // -----------------------------------------

    const finalY = doc.lastAutoTable.finalY || 50;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(
      `Moyenne Générale: ${studentResult.overallAverage.toFixed(2)} / 20`,
      14,
      finalY + 10
    );

    doc.save(`bulletin_${studentResult.studentName.replace(' ', '_')}.pdf`);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (message) {
    return <Typography color="error" sx={{ mt: 4 }}>{message}</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Bulletin de Notes : {report?.className}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          component={Link}
          to={`/class/${classId}/grades`}
        >
          Modifier les notes
        </Button>
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
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
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
                  <IconButton color="primary" onClick={() => handleDownloadPDF(studentResult)}>
                    <DownloadIcon />
                  </IconButton>
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