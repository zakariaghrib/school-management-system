import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import classService from '../services/classService';
import { AuthContext } from '../context/AuthContext';
import { Container, Typography, List, ListItem, ListItemButton, ListItemText, Paper, Box } from '@mui/material';

const ResultsHubPage = () => {
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

  const handleClassSelect = (classId) => {
    // Redirige vers la page des résultats pour la classe sélectionnée
    navigate(`/classes/${classId}/results`);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Centre de Consultation des Résultats
        </Typography>
        <Typography variant="body1">
          Veuillez sélectionner une classe pour générer et afficher son bulletin de notes.
        </Typography>
      </Box>

      {message && <Typography color="error">{message}</Typography>}
      
      <Paper>
        <List>
          {classes.length > 0 ? (
            classes.map(cls => (
              <ListItem key={cls._id} disablePadding divider>
                <ListItemButton onClick={() => handleClassSelect(cls._id)}>
                  <ListItemText 
                    primary={cls.name} 
                    secondary={`Année: ${cls.year} - ${cls.students.length} étudiant(s)`} 
                  />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="Aucune classe n'a été trouvée. Veuillez en créer une dans la 'Gestion des Classes'." />
            </ListItem>
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default ResultsHubPage;