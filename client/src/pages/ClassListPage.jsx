import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classService from '../services/classService';
import { AuthContext } from '../context/AuthContext';
import {
  Container, Typography, Box, Button, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GradingIcon from '@mui/icons-material/Grading';
import { FaSchool } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ClassListPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false); // <-- CORRECTION APPLIQUÉE ICI
  const [classToDelete, setClassToDelete] = useState(null);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const loadClasses = () => {
    if (token) {
      setLoading(true);
      classService.getAllClasses(token)
        .then(response => setClasses(response.data))
        .catch(() => setError("Erreur de chargement des classes."))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadClasses();
  }, [token]);

  const handleOpenModal = (cls) => {
    setClassToDelete(cls);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setClassToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!classToDelete) return;
    try {
      await classService.deleteClass(classToDelete._id, token);
      loadClasses();
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
          <FaSchool className="text-4xl text-gray-600 mr-3" />
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Gestion des Classes
            </Typography>
            <Typography color="text.secondary">
              Consulter, créer et gérer les classes de l'école.
            </Typography>
          </Box>
        </Box>
        {user?.role === 'admin' && (
          <Button variant="contained" startIcon={<AddIcon />} component={Link} to="/classes/add">
            Ajouter une Classe
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Nom</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Année</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Professeur Principal</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>N° Étudiants</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} align="center"><CircularProgress /></TableCell></TableRow>
              ) : (
                classes.map((cls, index) => (
                  <motion.tr
                    key={cls._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    style={{ display: 'table-row' }}
                  >
                    <TableCell>{cls.name}</TableCell>
                    <TableCell>{cls.year}</TableCell>
                    <TableCell>{cls.mainTeacher ? `${cls.mainTeacher.firstName} ${cls.mainTeacher.lastName}` : 'N/A'}</TableCell>
                    <TableCell>{cls.students.length}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Saisir les notes">
                        <IconButton color="default" onClick={() => navigate(`/class/${cls._id}/grades`)}>
                          <GradingIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Voir les résultats">
                        <IconButton color="secondary" onClick={() => navigate(`/classes/${cls._id}/results`)}>
                          <AssessmentIcon />
                        </IconButton>
                      </Tooltip>
                      {user?.role === 'admin' && (
                        <>
                          <Tooltip title="Modifier">
                            <IconButton color="primary" onClick={() => navigate(`/classes/edit/${cls._id}`)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton color="error" onClick={() => handleOpenModal(cls)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
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
            Êtes-vous sûr de vouloir supprimer la classe : <strong>{classToDelete?.name}</strong> ? Cette action est irréversible.
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

export default ClassListPage;