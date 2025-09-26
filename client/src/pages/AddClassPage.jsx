import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import classService from '../services/classService';
import teacherService from '../services/teacherService';
import { AuthContext } from '../context/AuthContext';

// Importations MUI
import { 
  Container, Typography, Box, TextField, Button, 
  FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';

const AddClassPage = () => {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [mainTeacher, setMainTeacher] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [message, setMessage] = useState('');
  
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // Cet appel va maintenant fonctionner correctement
      teacherService.getAllTeachers(token)
        .then(response => setTeachers(response.data))
        .catch(() => setMessage("Erreur de chargement des enseignants."));
    }
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await classService.createClass({ name, year, mainTeacher }, token);
      navigate('/classes');
    } catch (error) {
      setMessage(error.response?.data?.msg || "Erreur lors de la création.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography component="h1" variant="h5">
          Ajouter une nouvelle Classe
        </Typography>
        <Box component="form" onSubmit={handleCreate} sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nom de la classe (ex: 6ème A)"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="year"
            label="Année scolaire (ex: 2025-2026)"
            value={year}
            onChange={e => setYear(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="teacher-select-label">Professeur Principal</InputLabel>
            <Select
              labelId="teacher-select-label"
              value={mainTeacher}
              label="Professeur Principal"
              onChange={e => setMainTeacher(e.target.value)}
            >
              <MenuItem value="">
                <em>-- Sélectionnez un enseignant --</em>
              </MenuItem>
              {teachers.map(teacher => (
                <MenuItem key={teacher._id} value={teacher._id}>
                  {teacher.firstName} {teacher.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Créer la Classe
          </Button>
          {message && <Typography color="error">{message}</Typography>}
        </Box>
      </Box>
    </Container>
  );
};

export default AddClassPage;