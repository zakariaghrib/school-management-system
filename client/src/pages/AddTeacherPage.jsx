import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import teacherService from '../services/teacherService';
import subjectService from '../services/subjectService';
import { AuthContext } from '../context/AuthContext';

// Importations MUI
import { 
  Container, Typography, Box, TextField, Button, FormControl, 
  InputLabel, Select, MenuItem, OutlinedInput, Chip 
} from '@mui/material';

const AddTeacherPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [message, setMessage] = useState('');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.token) {
      subjectService.getAllSubjects(user.token)
        .then(response => setSubjects(response.data))
        .catch(() => setMessage("Erreur de chargement des matières."));
    }
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const teacherData = { 
      firstName, 
      lastName, 
      contact: { email }, 
      subjects: selectedSubjects 
    };
    try {
      await teacherService.createTeacher(teacherData, user.token);
      navigate('/teachers');
    } catch (error) {
      setMessage(error.response?.data?.msg || "Erreur lors de la création.");
    }
  };

  const handleSubjectChange = (event) => {
    const { target: { value } } = event;
    setSelectedSubjects(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography component="h1" variant="h5">
          Ajouter un nouvel Enseignant
        </Typography>
        <Box component="form" onSubmit={handleCreate} sx={{ mt: 3 }}>
          <TextField
            margin="normal" required fullWidth
            label="Prénom" value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
          <TextField
            margin="normal" required fullWidth
            label="Nom" value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
          <TextField
            margin="normal" required fullWidth
            label="Email" type="email" value={email}
            onChange={e => setEmail(e.target.value)}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="subjects-select-label">Matières Enseignées</InputLabel>
            <Select
              labelId="subjects-select-label"
              multiple
              value={selectedSubjects}
              onChange={handleSubjectChange}
              input={<OutlinedInput label="Matières Enseignées" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const subject = subjects.find(s => s._id === value);
                    return <Chip key={value} label={subject ? subject.name : ''} />;
                  })}
                </Box>
              )}
            >
              {subjects.map((subject) => (
                <MenuItem key={subject._id} value={subject._id}>
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Créer l'Enseignant
          </Button>
          {message && <Typography color="error">{message}</Typography>}
        </Box>
      </Box>
    </Container>
  );
};

export default AddTeacherPage;