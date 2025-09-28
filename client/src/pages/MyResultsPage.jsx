import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import gradeService from '../services/gradeService';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  Container, Typography, Box, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Button,
  CircularProgress, Alert
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { FaFileSignature } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MyResultsPage = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      setLoading(true);
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

    doc.save(`bulletin_${results.studentName.replace(/ /g, '_')}.pdf`);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          <Typography variant="h6">Erreur</Typography>
          {error} <br/>
          Veuillez contacter un administrateur pour lier votre compte à votre profil étudiant.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f4f7f9', minHeight: 'calc(100vh - 64px)' }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {!results || results.gradesBySubject.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
            <Typography variant="h5">Aucun résultat trouvé pour le moment.</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>Vos notes apparaîtront ici dès qu'elles seront publiées.</Typography>
          </Paper>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FaFileSignature className="text-4xl text-gray-600 mr-3" />
                <Box>
                  <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    Mes Résultats
                  </Typography>
                  <Typography color="text.secondary">
                    {results.studentName} - Classe : {results.className}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadPDF}
              >
                Télécharger (PDF)
              </Button>
            </Box>

            <Paper sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Matière</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Moyenne / 20</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.gradesBySubject.map((grade, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        style={{ display: 'table-row' }}
                      >
                        <TableCell>{grade.subjectName}</TableCell>
                        <TableCell align="right">
                          {grade.average !== null ? grade.average.toFixed(2) : '—'}
                        </TableCell>
                      </motion.tr>
                    ))}
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Moyenne Générale</TableCell>
                      <TableCell align="right" sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'primary.main' }}>
                        {results.overallAverage.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};

export default MyResultsPage;