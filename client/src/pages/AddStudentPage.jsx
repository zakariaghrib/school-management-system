import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import studentService from '../services/studentService';
import classService from '../services/classService';
import { AuthContext } from '../context/AuthContext';
import { Container, Typography, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const AddStudentPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [classId, setClassId] = useState(''); // État pour la classe sélectionnée
  const [classes, setClasses] = useState([]); // État pour la liste des classes
  const [message, setMessage] = useState('');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Charger les classes au montage du composant
  useEffect(() => {
    if (user?.token) {
      classService.getAllClasses(user.token)
        .then(response => setClasses(response.data))
        .catch(() => setMessage("Erreur de chargement des classes."));
    }
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // Inclure l'ID de la classe dans les données envoyées
      await studentService.createStudent({ firstName, lastName, dateOfBirth, class: classId }, user.token);
      navigate('/students');
    } catch (error) {
      setMessage(error.response?.data?.msg || "Erreur de création.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Ajouter un nouvel Étudiant
        </Typography>
        <Box component="form" onSubmit={handleCreate} sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal" required fullWidth
            label="Prénom" value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            margin="normal" required fullWidth
            label="Nom" value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            margin="normal" required fullWidth
            label="Date de Naissance" type="date"
            InputLabelProps={{ shrink: true }}
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
          
          {/* --- MENU DÉROULANT POUR LES CLASSES --- */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="class-select-label">Classe</InputLabel>
            <Select
              labelId="class-select-label"
              value={classId}
              label="Classe"
              onChange={(e) => setClassId(e.target.value)}
            >
              <MenuItem value=""><em>Non assigné</em></MenuItem>
              {classes.map((cls) => (
                <MenuItem key={cls._id} value={cls._id}>{cls.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* ------------------------------------ */}

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Créer l'Étudiant
          </Button>
          {message && <Typography color="error">{message}</Typography>}
        </Box>
      </Box>
    </Container>
  );
};

export default AddStudentPage;