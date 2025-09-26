import React, { useState, useEffect, useContext } from 'react';
import subjectService from '../services/subjectService';
import { AuthContext } from '../context/AuthContext';
import { 
  Container, Typography, Box, TextField, Button,
  List, ListItem, ListItemText, IconButton, Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const SubjectListPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useContext(AuthContext); // Utiliser le token

  const loadSubjects = () => {
    if (token) {
      subjectService.getAllSubjects(token) // Passer le token
        .then(response => setSubjects(response.data))
        .catch(() => setMessage("Erreur de chargement des matières."));
    }
  };

  useEffect(() => {
    loadSubjects();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await subjectService.createSubject({ name: newSubjectName }, token); // Passer le token
      setNewSubjectName('');
      loadSubjects();
    } catch (error) {
      setMessage(error.response?.data?.msg || "Erreur de création.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr ?')) {
      try {
        await subjectService.deleteSubject(id, token); // Passer le token
        loadSubjects();
      } catch (error) {
        setMessage(error.response?.data?.msg || "Erreur de suppression.");
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" sx={{ my: 4 }}>
        Gestion des Matières
      </Typography>
      
      <Box component="form" onSubmit={handleCreate} sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          label="Nom de la nouvelle matière"
          variant="outlined"
          value={newSubjectName}
          onChange={(e) => setNewSubjectName(e.target.value)}
          required
          fullWidth
        />
        <Button type="submit" variant="contained">Ajouter</Button>
      </Box>

      {message && <Typography color="error">{message}</Typography>}

      <Paper>
        <List>
          {subjects.map((subject) => (
            <ListItem
              key={subject._id}
              divider
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDelete(subject._id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              }
            >
              <ListItemText primary={subject.name} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default SubjectListPage;