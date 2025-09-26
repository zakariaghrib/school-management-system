import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import teacherService from '../services/teacherService';
import { AuthContext } from '../context/AuthContext';
import { 
  Container, Typography, Box, Button, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, IconButton, Chip 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TeacherListPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [message, setMessage] = useState('');
  const { token } = useContext(AuthContext); // Utiliser le token du contexte
  const navigate = useNavigate();

  const loadTeachers = () => {
    if (token) {
      teacherService.getAllTeachers(token) // Passer le token
        .then(response => setTeachers(response.data))
        .catch(() => setMessage("Erreur de chargement des enseignants."));
    }
  };

  useEffect(() => {
    loadTeachers();
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr ?')) {
      try {
        await teacherService.deleteTeacher(id, token); // Passer le token
        loadTeachers();
      } catch (error) {
        setMessage(error.response?.data?.msg || "Erreur de suppression.");
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 4 }}>
        <Typography variant="h4">Gestion des Enseignants</Typography>
        <Button variant="contained" startIcon={<AddIcon />} component={Link} to="/teachers/add">
          Ajouter un Enseignant
        </Button>
      </Box>

      {message && <Typography color="error">{message}</Typography>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Matières</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher._id} hover>
                <TableCell>{teacher.firstName} {teacher.lastName}</TableCell>
                <TableCell>{teacher.contact.email}</TableCell>
                <TableCell>
                  {teacher.subjects?.map(subject => (
                    <Chip key={subject._id} label={subject.name} sx={{ mr: 0.5 }} size="small" />
                  ))}
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => navigate(`/teachers/edit/${teacher._id}`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(teacher._id)}>
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

export default TeacherListPage;