import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import classService from '../services/classService';
import { AuthContext } from '../context/AuthContext';
import { Container, Typography, List, ListItem, ListItemButton, ListItemText, Paper } from '@mui/material';

const GradeEntryHubPage = () => {
  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.token) {
      classService.getAllClasses(user.token)
        .then(response => setClasses(response.data))
        .catch(error => setMessage(error.response?.data?.msg || "Erreur de chargement des classes."));
    }
  }, [user]);

  // Redirige vers la page de saisie des notes pour la classe sélectionnée
  const handleClassSelect = (classId) => {
    navigate(`/class/${classId}/grades`);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" sx={{ my: 4 }}>
        Portail de Saisie des Notes
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Veuillez sélectionner une classe pour commencer à saisir les notes des étudiants.
      </Typography>
      {message && <Typography color="error">{message}</Typography>}
      <Paper>
        <List>
          {classes.map(cls => (
            <ListItem key={cls._id} disablePadding divider>
              <ListItemButton onClick={() => handleClassSelect(cls._id)}>
                <ListItemText 
                  primary={cls.name} 
                  secondary={`Année: ${cls.year} - Prof. Principal: ${cls.mainTeacher ? cls.mainTeacher.firstName + ' ' + cls.mainTeacher.lastName : 'N/A'}`} 
                />
              </ListItemButton>
            </ListItem>
          ))}
          {classes.length === 0 && (
            <ListItem>
              <ListItemText primary="Aucune classe n'a été trouvée." />
            </ListItem>
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default GradeEntryHubPage;
