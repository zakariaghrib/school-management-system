import React, {useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import studentService from '../services/studentService';
import classService from '../services/classService';
import { AuthContext } from '../context/AuthContext';
import {
  Container, Typography, Box, Button, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton,
  FormControl, InputLabel, Select, MenuItem, Tooltip,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { FaUserGraduate } from 'react-icons/fa';
import { motion } from 'framer-motion';

const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const loadStudents = () => {
    if (token) {
      setLoading(true);
      studentService.getAllStudents(token, selectedClass || null)
        .then(response => setStudents(response.data))
        .catch(() => setError("Erreur de chargement des étudiants."))
        .finally(() => setLoading(false));
    }
  };
  
  useEffect(() => {
    if (token) {
      classService.getAllClasses(token)
        .then(response => setClasses(response.data))
        .catch(() => setError("Erreur de chargement des classes."));
    }
  }, [token]);

  useEffect(() => {
    loadStudents();
  }, [selectedClass, token]);

  const handleOpenModal = (student) => {
    setStudentToDelete(student);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setStudentToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      await studentService.deleteStudent(studentToDelete._id, token);
      loadStudents();
    } catch (err) {
      setError(err.response?.data?.msg || "Erreur lors de la suppression.");
    } finally {
      handleCloseModal();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FaUserGraduate className="text-4xl text-gray-600 mr-3" />
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Gestion des Étudiants
            </Typography>
            <Typography color="text.secondary">
              Consulter, ajouter et gérer les profils étudiants.
            </Typography>
          </Box>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} component={Link} to="/students/add">
          Ajouter un Étudiant
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 4, borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <FormControl fullWidth>
          <InputLabel>Filtrer par Classe</InputLabel>
          <Select
            value={selectedClass}
            label="Filtrer par Classe"
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <MenuItem value=""><em>Toutes les classes</em></MenuItem>
            {classes.map((cls) => (
              <MenuItem key={cls._id} value={cls._id}>{cls.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Prénom</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nom</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Classe</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date de Naissance</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} align="center"><CircularProgress /></TableCell></TableRow>
              ) : (
                students.map((student, index) => (
                  <motion.tr
                    key={student._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    style={{ display: 'table-row' }}
                  >
                    <TableCell>{student.firstName}</TableCell>
                    <TableCell>{student.lastName}</TableCell>
                    <TableCell>{student.class ? student.class.name : 'Non assigné'}</TableCell>
                    <TableCell>{new Date(student.dateOfBirth).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Voir le relevé de notes"><IconButton color="secondary" onClick={() => navigate(`/students/${student._id}/grades`)}><ListAltIcon /></IconButton></Tooltip>
                      <Tooltip title="Modifier"><IconButton color="primary" onClick={() => navigate(`/students/edit/${student._id}`)}><EditIcon /></IconButton></Tooltip>
                      <Tooltip title="Supprimer"><IconButton color="error" onClick={() => handleOpenModal(student)}><DeleteIcon /></IconButton></Tooltip>
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
            Êtes-vous sûr de vouloir supprimer l'étudiant : <strong>{studentToDelete?.firstName} {studentToDelete?.lastName}</strong> ? Cette action est irréversible.
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

export default StudentListPage;