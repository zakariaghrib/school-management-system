import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import teacherService from '../services/teacherService';
import { AuthContext } from '../context/AuthContext';
import {
  Container, Typography, Box, Button, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton, Chip,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { motion } from 'framer-motion';

const TeacherListPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const loadTeachers = () => {
    if (token) {
      setLoading(true);
      teacherService.getAllTeachers(token)
        .then(response => setTeachers(response.data))
        .catch(() => setError("Erreur de chargement des enseignants."))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadTeachers();
  }, [token]);

  const handleOpenModal = (teacher) => {
    setTeacherToDelete(teacher);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTeacherToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!teacherToDelete) return;
    try {
      await teacherService.deleteTeacher(teacherToDelete._id, token);
      loadTeachers();
    } catch (err) {
      setError(err.response?.data?.msg || "Erreur de suppression.");
    } finally {
      handleCloseModal();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FaChalkboardTeacher className="text-4xl text-gray-600 mr-3" />
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Gestion des Enseignants
            </Typography>
            <Typography color="text.secondary">
              Consulter, ajouter et gérer les profils enseignants.
            </Typography>
          </Box>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} component={Link} to="/teachers/add">
          Ajouter un Enseignant
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Nom</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email de Connexion</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Matières</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} align="center"><CircularProgress /></TableCell></TableRow>
              ) : (
                teachers.map((teacher, index) => (
                  <motion.tr
                    key={teacher._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    style={{ display: 'table-row' }}
                  >
                    <TableCell>{teacher.firstName} {teacher.lastName}</TableCell>
                    {/* CORRECTION : L'email se trouve dans userAccount */}
                    <TableCell>{teacher.userAccount?.email || 'Non défini'}</TableCell>
                    <TableCell>
                      {teacher.subjects?.map(subject => (
                        <Chip key={subject._id} label={subject.name} sx={{ mr: 0.5 }} size="small" />
                      ))}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Modifier"><IconButton color="primary" onClick={() => navigate(`/teachers/edit/${teacher._id}`)}><EditIcon /></IconButton></Tooltip>
                      <Tooltip title="Supprimer"><IconButton color="error" onClick={() => handleOpenModal(teacher)}><DeleteIcon /></IconButton></Tooltip>
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
            Êtes-vous sûr de vouloir supprimer l'enseignant : <strong>{teacherToDelete?.firstName} {teacherToDelete?.lastName}</strong> ? Cette action est irréversible.
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

export default TeacherListPage;