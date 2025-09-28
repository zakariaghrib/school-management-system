import React, { useState, useEffect, useContext } from 'react';
import subjectService from '../services/subjectService';
import { AuthContext } from '../context/AuthContext';
import {
  Container, Typography, Box, TextField, Button, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, CircularProgress, Alert, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { FaBook } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SubjectListPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const { token } = useContext(AuthContext);

  const loadSubjects = () => {
    if (token) {
      setLoading(true);
      subjectService.getAllSubjects(token)
        .then(response => setSubjects(response.data))
        .catch(() => setError("Erreur de chargement des matières."))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadSubjects();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) {
      setError("Le nom de la matière ne peut pas être vide.");
      return;
    }
    setError('');
    try {
      await subjectService.createSubject({ name: newSubjectName }, token);
      setNewSubjectName('');
      loadSubjects();
    } catch (err) {
      setError(err.response?.data?.msg || "Erreur de création.");
    }
  };

  const handleOpenModal = (subject) => {
    setSubjectToDelete(subject);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSubjectToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!subjectToDelete) return;
    try {
      await subjectService.deleteSubject(subjectToDelete._id, token);
      loadSubjects();
    } catch (err) {
      setError(err.response?.data?.msg || "Erreur de suppression.");
    } finally {
      handleCloseModal();
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <FaBook className="text-4xl text-gray-600 mr-3" />
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Gestion des Matières
          </Typography>
          <Typography color="text.secondary">
            Ajouter ou supprimer les matières enseignées dans l'école.
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" gutterBottom>Ajouter une nouvelle matière</Typography>
        <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Nom de la matière"
            variant="outlined"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" sx={{ px: 4 }}>Ajouter</Button>
        </Box>
      </Paper>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Nom de la Matière</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={2} align="center"><CircularProgress /></TableCell></TableRow>
              ) : (
                subjects.map((subject, index) => (
                  <motion.tr
                    key={subject._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    style={{ display: 'table-row' }}
                  >
                    <TableCell component="th" scope="row">{subject.name}</TableCell>
                    <TableCell align="right">
                      <IconButton title="Supprimer" onClick={() => handleOpenModal(subject)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* --- MODAL DE CONFIRMATION DE SUPPRESSION --- */}
      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>Confirmer la Suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer la matière : <strong>{subjectToDelete?.name}</strong> ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SubjectListPage;