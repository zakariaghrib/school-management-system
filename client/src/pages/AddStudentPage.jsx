import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import studentService from '../services/studentService';
import classService from '../services/classService';
import { AuthContext } from '../context/AuthContext';
import { Container, Typography, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const AddStudentPage = () => {
  // États pour le profil étudiant
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [classId, setClassId] = useState('');
  
  // --- NOUVEAUX ÉTATS POUR LE COMPTE UTILISATEUR ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // --------------------------------------------------

  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState('');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
      // Envoyer toutes les informations au backend
      await studentService.createStudent({ 
        firstName, 
        lastName, 
        dateOfBirth, 
        class: classId, 
        email, 
        password 
      }, user.token);
      navigate('/students');
    } catch (error) {
      setMessage(error.response?.data?.msg || "Erreur de création.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography component="h1" variant="h5">
          Inscrire un nouvel Étudiant
        </Typography>
        <Box component="form" onSubmit={handleCreate} sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>Informations du Profil</Typography>
          <TextField margin="normal" required fullWidth label="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <TextField margin="normal" required fullWidth label="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <TextField margin="normal" required fullWidth label="Date de Naissance" type="date" InputLabelProps={{ shrink: true }} value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Classe</InputLabel>
            <Select value={classId} label="Classe" onChange={(e) => setClassId(e.target.value)}>
              <MenuItem value=""><em>Non assigné</em></MenuItem>
              {classes.map((cls) => (<MenuItem key={cls._id} value={cls._id}>{cls.name}</MenuItem>))}
            </Select>
          </FormControl>

          <hr style={{ margin: '20px 0' }}/>
          <Typography variant="subtitle1" gutterBottom>Informations de Connexion</Typography>
          {/* --- NOUVEAUX CHAMPS --- */}
          <TextField margin="normal" required fullWidth label="Email de l'étudiant" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField margin="normal" required fullWidth label="Mot de passe initial" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {/* ------------------------- */}
          
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Inscrire l'Étudiant
          </Button>
          {message && <Typography color="error">{message}</Typography>}
        </Box>
      </Box>
    </Container>
  );
};

export default AddStudentPage;