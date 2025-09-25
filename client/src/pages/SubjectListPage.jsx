import React, { useState, useEffect, useContext } from 'react'; // <-- CORRECTION ICI
import subjectService from '../services/subjectService';
import { AuthContext } from '../context/AuthContext';

// Importations MUI
import { 
  Container, Typography, Box, TextField, Button,
  List, ListItem, ListItemText, IconButton, Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const SubjectListPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);

  const loadSubjects = () => {
    if (user?.token) {
      subjectService.getAllSubjects(user.token)
        .then(response => setSubjects(response.data))
        .catch(() => setMessage("Erreur de chargement des matières."));
    }
  };

  useEffect(() => {
    loadSubjects();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await subjectService.createSubject({ name: newSubjectName }, user.token);
      setNewSubjectName('');
      loadSubjects(); // Recharger la liste
    } catch (error) {
      setMessage(error.response?.data?.msg || "Erreur lors de la création.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
      try {
        await subjectService.deleteSubject(id, user.token);
        loadSubjects(); // Recharger la liste
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
      
      {/* Formulaire d'ajout */}
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

      {/* Liste des matières */}
      <Paper>
        <List>
          {subjects.map((subject) => (
            <ListItem
              key={subject._id}
              divider
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(subject._id)}>
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