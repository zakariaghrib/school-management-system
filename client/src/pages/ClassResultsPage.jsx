import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import gradeService from '../services/gradeService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // **LA CORRECTION EST ICI**
import {
  Container, Typography, Box, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, CircularProgress,
  Button, IconButton, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';

const ClassResultsPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token && classId) {
      gradeService.getDetailedClassResults(classId, token)
        .then(response => setResultsData(response.data))
        .catch(err => setError('Erreur lors du chargement des résultats.'))
        .finally(() => setLoading(false));
    }
  }, [classId, token]);

  const handleDownloadGlobalPDF = () => {
    if (!resultsData) return;
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.setFontSize(16);
    doc.text(`Bilan Global - Classe : ${resultsData.className}`, 14, 20);

    const head = [
      "Nom de l'Étudiant",
      ...resultsData.allSubjects.map(s => s.name),
      "Moyenne Générale"
    ];

    const body = resultsData.results.map(student => [
      student.studentName,
      ...resultsData.allSubjects.map(subject => {
        const gradeInfo = student.gradesBySubject.find(g => g.subjectId === subject._id);
        return gradeInfo ? parseFloat(gradeInfo.average).toFixed(2) : '—';
      }),
      parseFloat(student.overallAverage).toFixed(2)
    ]);

    // **LA CORRECTION EST ICI**
    autoTable(doc, {
      head: [head],
      body: body,
      startY: 30,
      theme: 'grid',
    });

    doc.save(`bilan_global_${resultsData.className}.pdf`);
  };

  const handleDownloadIndividualPDF = (student) => {
    if (!resultsData) return;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Bulletin de Notes`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Étudiant : ${student.studentName}`, 14, 30);
    doc.text(`Classe : ${resultsData.className}`, 14, 38);

    const head = [["Matière", "Moyenne / 20"]];
    const body = resultsData.allSubjects
      .map(subject => {
        const gradeInfo = student.gradesBySubject.find(g => g.subjectId === subject._id);
        if (gradeInfo) {
          return [subject.name, parseFloat(gradeInfo.average).toFixed(2)];
        }
        return null;
      })
      .filter(row => row !== null);

    // **LA CORRECTION EST ICI**
    autoTable(doc, {
      head: head,
      body: body,
      startY: 50,
      theme: 'striped',
    });

    const finalY = doc.lastAutoTable.finalY || 60;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`Moyenne Générale : ${parseFloat(student.overallAverage).toFixed(2)} / 20`, 14, finalY + 15);

    doc.save(`bulletin_${student.studentName.replace(/ /g, '_')}.pdf`);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
  if (!resultsData) return <Typography sx={{ mt: 4 }}>Aucune donnée à afficher.</Typography>;

  return (
    // ... Votre JSX reste le même
    <Container maxWidth={false}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 4 }}>
        <Typography variant="h4">Bulletin : {resultsData.className}</Typography>
        <Box>
          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/class/${classId}/grades`)} sx={{ mr: 2 }}>
            Saisir / Modifier les notes
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleDownloadGlobalPDF}>
            Télécharger le Bilan Global (PDF)
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Nom de l'Étudiant</TableCell>
              {resultsData.allSubjects.map(s => <TableCell key={s._id} sx={{ fontWeight: 'bold' }}>{s.name}</TableCell>)}
              <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Moyenne Générale</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Bulletin Individuel</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resultsData.results.map(student => (
              <TableRow key={student.studentId} hover>
                <TableCell>{student.studentName}</TableCell>
                {resultsData.allSubjects.map(subject => {
                  const gradeInfo = student.gradesBySubject.find(g => g.subjectId === subject._id);
                  return <TableCell key={subject._id}>{gradeInfo ? parseFloat(gradeInfo.average).toFixed(2) : '—'}</TableCell>;
                })}
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>{parseFloat(student.overallAverage).toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleDownloadIndividualPDF(student)}>
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