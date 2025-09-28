import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import gradeService from '../services/gradeService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Container, Typography, Box, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, CircularProgress,
  Button, IconButton, Alert, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import { FaPoll } from 'react-icons/fa';
import { motion } from 'framer-motion';

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
    doc.text(`Bilan Global - Classe : ${resultsData.className}`, 14, 20);
    const head = [ "Nom de l'Étudiant", ...resultsData.allSubjects.map(s => s.name), "Moyenne Générale" ];
    const body = resultsData.results.map(student => [
      student.studentName,
      ...resultsData.allSubjects.map(subject => {
        const gradeInfo = student.gradesBySubject.find(g => g.subjectId === subject._id);
        return gradeInfo ? parseFloat(gradeInfo.average).toFixed(2) : '—';
      }),
      parseFloat(student.overallAverage).toFixed(2)
    ]);
    autoTable(doc, { head: [head], body: body, startY: 30, theme: 'grid' });
    doc.save(`bilan_global_${resultsData.className}.pdf`);
  };

  const handleDownloadIndividualPDF = (student) => {
    if (!resultsData) return;
    const doc = new jsPDF();
    doc.text(`Bulletin de Notes`, 14, 20);
    doc.text(`Étudiant : ${student.studentName}`, 14, 30);
    doc.text(`Classe : ${resultsData.className}`, 14, 38);
    const head = [["Matière", "Moyenne / 20"]];
    const body = resultsData.allSubjects
      .map(subject => {
        const gradeInfo = student.gradesBySubject.find(g => g.subjectId === subject._id);
        return gradeInfo ? [subject.name, parseFloat(gradeInfo.average).toFixed(2)] : null;
      })
      .filter(row => row !== null);
    autoTable(doc, { head: head, body: body, startY: 50, theme: 'striped' });
    const finalY = doc.lastAutoTable.finalY || 60;
    doc.setFont(undefined, 'bold');
    doc.text(`Moyenne Générale : ${parseFloat(student.overallAverage).toFixed(2)} / 20`, 14, finalY + 15);
    doc.save(`bulletin_${student.studentName.replace(/ /g, '_')}.pdf`);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;
  
  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FaPoll className="text-4xl text-gray-600 mr-3" />
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Bulletin de la Classe
            </Typography>
            <Typography color="text.secondary">
              {resultsData?.className || 'Chargement...'}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/class/${classId}/grades`)} sx={{ mr: 2 }}>
            Saisir / Modifier
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleDownloadGlobalPDF}>
            Bilan Global (PDF)
          </Button>
        </Box>
      </Box>

      {!resultsData || resultsData.results.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
          <Typography variant="h5">Aucun résultat à afficher</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>Saisissez des notes pour cette classe pour voir le bulletin apparaître ici.</Typography>
        </Paper>
      ) : (
        <Paper sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>Nom de l'Étudiant</TableCell>
                  {resultsData.allSubjects.map(s => <TableCell key={s._id} sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>{s.name}</TableCell>)}
                  <TableCell sx={{ fontWeight: 'bold', color: 'primary.main', bgcolor: 'grey.100' }}>Moyenne Générale</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>Bulletin Individuel</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resultsData.results.map((student, index) => (
                  <motion.tr
                    key={student.studentId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    style={{ display: 'table-row' }}
                  >
                    <TableCell>{student.studentName}</TableCell>
                    {resultsData.allSubjects.map(subject => {
                      const gradeInfo = student.gradesBySubject.find(g => g.subjectId === subject._id);
                      return <TableCell key={subject._id}>{gradeInfo ? parseFloat(gradeInfo.average).toFixed(2) : '—'}</TableCell>;
                    })}
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>{parseFloat(student.overallAverage).toFixed(2)}</TableCell>
                    <TableCell>
                      <Tooltip title="Télécharger le bulletin individuel">
                        <IconButton color="primary" onClick={() => handleDownloadIndividualPDF(student)}>
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default ClassResultsPage;