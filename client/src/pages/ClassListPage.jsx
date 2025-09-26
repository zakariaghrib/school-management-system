import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classService from '../services/classService';
import { AuthContext } from '../context/AuthContext';
import { 
  Container, Typography, Box, Button, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, IconButton 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GradingIcon from '@mui/icons-material/Grading';

const ClassListPage = () => {
  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState('');
  const { user, token } = useContext(AuthContext); // Utiliser le token
  const navigate = useNavigate();

  const loadClasses = () => {
    if (token) {
      classService.getAllClasses(token)
        .then(response => setClasses(response.data))
        .catch(() => setMessage("Erreur de chargement des classes."));
    }
  };

  useEffect(() => {
    loadClasses();
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr ?')) {
      try {
        await classService.deleteClass(id, token);
        loadClasses();
      } catch (error) {
        setMessage(error.response?.data?.msg || "Erreur de suppression.");
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 4 }}>
        <Typography variant="h4">Gestion des Classes</Typography>
        {user?.role === 'admin' && (
          <Button variant="contained" startIcon={<AddIcon />} component={Link} to="/classes/add">
            Ajouter une Classe
          </Button>
        )}
      </Box>

      {message && <Typography color="error">{message}</Typography>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Année</TableCell>
              <TableCell>Professeur Principal</TableCell>
              <TableCell>Étudiants</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map((cls) => (
              <TableRow key={cls._id} hover>
                <TableCell>{cls.name}</TableCell>
                <TableCell>{cls.year}</TableCell>
                <TableCell>{cls.mainTeacher ? `${cls.mainTeacher.firstName} ${cls.mainTeacher.lastName}` : 'N/A'}</TableCell>
                <TableCell>{cls.students.length}</TableCell>
                <TableCell align="right">
                  <IconButton title="Saisir les notes" color="default" onClick={() => navigate(`/class/${cls._id}/grades`)}>
                    <GradingIcon />
                  </IconButton>
                  <IconButton title="Voir les résultats" color="secondary" onClick={() => navigate(`/classes/${cls._id}/results`)}>
                    <AssessmentIcon />
                  </IconButton>
                  {user?.role === 'admin' && (
                    <>
                      <IconButton title="Modifier" color="primary" onClick={() => navigate(`/classes/edit/${cls._id}`)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton title="Supprimer" color="error" onClick={() => handleDelete(cls._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ClassListPage;