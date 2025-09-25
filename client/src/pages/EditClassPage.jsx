import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classService from '../services/classService';
import teacherService from '../services/teacherService';
import { AuthContext } from '../context/AuthContext';

// Importations MUI
import { 
  Container, Typography, Box, TextField, Button, 
  FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';

const EditClassPage = () => {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [mainTeacher, setMainTeacher] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [message, setMessage] = useState('');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams(); // Récupère l'ID de la classe depuis l'URL

  // Charger les données de la classe et la liste des enseignants
  useEffect(() => {
    if (user?.token && id) {
      // Récupérer les détails de la classe à modifier
      classService.getClassById(id, user.token)
        .then(response => {
          const cls = response.data;
          setName(cls.name);
          setYear(cls.year);
          setMainTeacher(cls.mainTeacher?._id || '');
        })
        .catch(() => setMessage("Erreur de chargement de la classe."));
      
      // Récupérer tous les enseignants pour le menu déroulant
      teacherService.getAllTeachers(user.token)
        .then(response => setTeachers(response.data))
        .catch(() => setMessage("Erreur de chargement des enseignants."));
    }
  }, [user, id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await classService.updateClass(id, { name, year, mainTeacher }, user.token);
      navigate('/classes');
    } catch (error) {
      setMessage(error.response?.data?.msg || "Erreur lors de la mise à jour.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography component="h1" variant="h5">
          Modifier la Classe
        </Typography>
        <Box component="form" onSubmit={handleUpdate} sx={{ mt: 3 }}>
          <TextField
            margin="normal" required fullWidth
            label="Nom de la classe" value={name}
            onChange={e => setName(e.target.value)}
          />
          <TextField
            margin="normal" required fullWidth
            label="Année scolaire" value={year}
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
              <MenuItem value=""><em>Non assigné</em></MenuItem>
              {teachers.map(teacher => (
                <MenuItem key={teacher._id} value={teacher._id}>
                  {teacher.firstName} {teacher.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Mettre à jour
          </Button>
          {message && <Typography color="error">{message}</Typography>}
        </Box>
      </Box>
    </Container>
  );
};

export default EditClassPage;
