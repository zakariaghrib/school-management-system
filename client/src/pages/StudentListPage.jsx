import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import studentService from '../services/studentService';
import classService from '../services/classService';
import { AuthContext } from '../context/AuthContext';
import {
  Container, Typography, Box, Button, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ListAltIcon from '@mui/icons-material/ListAlt';

const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [message, setMessage] = useState('');

  const { token } = useContext(AuthContext); // ✅ Corrigé (une seule fois)
  const navigate = useNavigate();

  // Charger les étudiants
  const loadStudents = async () => {
    if (token) {
      try {
        const response = await studentService.getAllStudents(token, selectedClass || null);
        setStudents(response.data);
      } catch (error) {
        console.error(error);
        setMessage(error.response?.data?.msg || "Erreur de chargement des étudiants.");
      }
    }
  };

  // Charger les classes une seule fois au montage
  useEffect(() => {
    if (token) {
      classService.getAllClasses(token)
        .then(response => setClasses(response.data))
        .catch((error) => {
          console.error(error);
          setMessage("Erreur de chargement des classes.");
        });
    }
  }, [token]);

  // Recharger les étudiants quand la classe change
  useEffect(() => {
    loadStudents();
  }, [selectedClass, token]);

  // Supprimer un étudiant
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      try {
        await studentService.deleteStudent(id, token);
        loadStudents();
      } catch (error) {
        console.error(error);
        setMessage(error.response?.data?.msg || "Erreur lors de la suppression.");
      }
    }
  };

  return (
    <Container maxWidth="lg">
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 4 }}>
        <Typography variant="h4">Gestion des Étudiants</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/students/add"
        >
          Ajouter un Étudiant
        </Button>
      </Box>

      {/* Filtre par classe */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Filtrer par Classe</InputLabel>
        <Select
          value={selectedClass}
          label="Filtrer par Classe"
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <MenuItem value="">
            <em>Toutes les classes</em>
          </MenuItem>
          {classes.map((cls) => (
            <MenuItem key={cls._id} value={cls._id}>
              {cls.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Message d'erreur */}
      {message && <Typography color="error" sx={{ mb: 2 }}>{message}</Typography>}

      {/* Tableau des étudiants */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Prénom</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Classe</TableCell>
              <TableCell>Date de Naissance</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student._id} hover>
                  <TableCell>{student.firstName}</TableCell>
                  <TableCell>{student.lastName}</TableCell>
                  <TableCell>{student.class ? student.class.name : 'Non assigné'}</TableCell>
                  <TableCell>{new Date(student.dateOfBirth).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    {/* Actions */}
                    <IconButton
                      title="Voir le relevé de notes"
                      color="secondary"
                      onClick={() => navigate(`/students/${student._id}/grades`)}
                    >
                      <ListAltIcon />
                    </IconButton>
                    <IconButton
                      title="Modifier"
                      color="primary"
                      onClick={() => navigate(`/students/edit/${student._id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      title="Supprimer"
                      color="error"
                      onClick={() => handleDelete(student._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Aucun étudiant trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default StudentListPage;
