import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import studentService from '../services/studentService';
import classService from '../services/classService';
import { AuthContext } from '../context/AuthContext';
import { Container, Typography, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const EditStudentPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [classId, setClassId] = useState('');
  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState('');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams(); // Récupère l'ID de l'étudiant depuis l'URL

  useEffect(() => {
    if (user?.token && id) {
      // Charger les infos de l'étudiant à modifier
      studentService.getStudentById(id, user.token)
        .then(response => {
          const student = response.data;
          setFirstName(student.firstName);
          setLastName(student.lastName);
          // Formater la date correctement pour le champ de type 'date'
          setDateOfBirth(new Date(student.dateOfBirth).toISOString().split('T')[0]);
          setClassId(student.class?._id || '');
        })
        .catch(() => setMessage("Erreur de chargement de l'étudiant."));

      // Charger la liste des classes pour le menu déroulant
      classService.getAllClasses(user.token)
        .then(response => setClasses(response.data))
        .catch(() => setMessage("Erreur de chargement des classes."));
    }
  }, [user, id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await studentService.updateStudent(id, { firstName, lastName, dateOfBirth, class: classId }, user.token);
      navigate('/students');
    } catch (error) {
      setMessage(error.response?.data?.msg || "Erreur de mise à jour.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography component="h1" variant="h5">
          Modifier l'Étudiant
        </Typography>
        <Box component="form" onSubmit={handleUpdate} sx={{ mt: 3 }}>
          <TextField margin="normal" required fullWidth label="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <TextField margin="normal" required fullWidth label="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <TextField margin="normal" required fullWidth label="Date de Naissance" type="date" InputLabelProps={{ shrink: true }} value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
          
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
          
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Mettre à jour
          </Button>
          {message && <Typography color="error">{message}</Typography>}
        </Box>
      </Box>
    </Container>
  );
};

export default EditStudentPage;