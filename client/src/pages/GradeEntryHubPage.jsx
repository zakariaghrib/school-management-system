import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import classService from '../services/classService';
import { AuthContext } from '../context/AuthContext';
import { Container, Typography, List, ListItem, ListItemButton, ListItemText, Paper, Box } from '@mui/material';

const GradeEntryHubPage = () => {
  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState('');
  const { token } = useContext(AuthContext); // Utiliser le token
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      classService.getAllClasses(token) // Passer le token
        .then(response => setClasses(response.data))
        .catch(error => setMessage(error.response?.data?.msg || "Erreur de chargement."));
    }
  }, [token]);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Portail de Saisie des Notes
        </Typography>
        <Typography variant="body1">
          Veuillez sélectionner une classe pour commencer à saisir ou modifier les notes.
        </Typography>
      </Box>
      {message && <Typography color="error">{message}</Typography>}
      <Paper>
        <List>
          {classes.map(cls => (
            <ListItem key={cls._id} disablePadding divider>
              <ListItemButton onClick={() => navigate(`/class/${cls._id}/grades`)}>
                <ListItemText 
                  primary={cls.name} 
                  secondary={`Année: ${cls.year}`} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default GradeEntryHubPage;