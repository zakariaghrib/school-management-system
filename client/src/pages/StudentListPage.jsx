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

const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fonction pour charger les étudiants, maintenant réutilisable
  const loadStudents = () => {
    if (user?.token) {
      studentService.getAllStudents(user.token, selectedClass || null)
        .then(response => setStudents(response.data))
        .catch(error => setMessage(error.response?.data?.msg || "Erreur de chargement."));
    }
  };

  // Charger la liste des classes une seule fois
  useEffect(() => {
    if (user?.token) {
      classService.getAllClasses(user.token)
        .then(response => setClasses(response.data))
        .catch(() => setMessage("Erreur de chargement des classes."));
    }
  }, [user]);

  // Recharger les étudiants à chaque fois que le filtre change
  useEffect(() => {
    loadStudents();
  }, [selectedClass, user]);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      try {
        await studentService.deleteStudent(id, user.token);
        loadStudents(); // Recharger la liste
      } catch (error) {
        setMessage(error.response?.data?.msg || "Erreur de suppression.");
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 4 }}>
        <Typography variant="h4">Gestion des Étudiants</Typography>
        <Button variant="contained" startIcon={<AddIcon />} component={Link} to="/students/add">
          Ajouter un Étudiant
        </Button>
      </Box>

      <FormControl fullWidth sx={{ mb: 2 }}>
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
      
      {message && <Typography color="error">{message}</Typography>}

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
            {students.map((student) => (
              <TableRow key={student._id} hover>
                <TableCell>{student.firstName}</TableCell>
                <TableCell>{student.lastName}</TableCell>
                <TableCell>{student.class ? student.class.name : 'Non assigné'}</TableCell>
                <TableCell>{new Date(student.dateOfBirth).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => navigate(`/students/edit/${student._id}`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(student._id)}>
                    <DeleteIcon />
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

export default StudentListPage;