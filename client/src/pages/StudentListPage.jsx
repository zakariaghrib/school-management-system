import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import studentService from '../services/studentService';
import classService from '../services/classService'; // Importer le service des classes
import { AuthContext } from '../context/AuthContext';
import { Container, Typography, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(''); // Pour stocker la classe sélectionnée
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);

  // Charger les étudiants et les classes
  useEffect(() => {
    if (user?.token) {
      // Charger la liste des classes pour le filtre
      classService.getAllClasses(user.token)
        .then(response => setClasses(response.data))
        .catch(() => setMessage("Erreur de chargement des classes."));

      // Charger la liste des étudiants (filtrée si une classe est sélectionnée)
      studentService.getAllStudents(user.token, selectedClass || null)
        .then(response => setStudents(response.data))
        .catch(error => setMessage(error.response?.data?.msg || "Erreur de chargement des étudiants."));
    }
  }, [user, selectedClass]); // Se relance si la classe sélectionnée change

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 4 }}>
        <Typography variant="h4" component="h1">
          Gestion des Étudiants
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} component={Link} to="/students/add">
          Ajouter un Étudiant
        </Button>
      </Box>

      {/* --- MENU DE FILTRE --- */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="class-filter-label">Filtrer par Classe</InputLabel>
        <Select
          labelId="class-filter-label"
          value={selectedClass}
          label="Filtrer par Classe"
          onChange={handleClassChange}
        >
          <MenuItem value=""><em>Toutes les classes</em></MenuItem>
          {classes.map((cls) => (
            <MenuItem key={cls._id} value={cls._id}>{cls.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* -------------------- */}
      
      {message && <Typography color="error">{message}</Typography>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Prénom</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Classe</TableCell>
              <TableCell>Date de Naissance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.firstName}</TableCell>
                <TableCell>{student.lastName}</TableCell>
                <TableCell>{student.class ? student.class.name : 'Non assigné'}</TableCell>
                <TableCell>{new Date(student.dateOfBirth).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default StudentListPage;