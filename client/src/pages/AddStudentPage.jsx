import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import studentService from '../services/studentService';
import classService from '../services/classService';
import { AuthContext } from '../context/AuthContext';
import {
  Container, Typography, Box, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Paper,
  CircularProgress, Alert, Divider
} from '@mui/material';
import { FaUserGraduate } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AddStudentPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    class: '',
    email: '',
    password: '',
  });
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      classService.getAllClasses(token)
        .then(response => setClasses(response.data))
        .catch(() => setError("Erreur de chargement des classes."));
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await studentService.createStudent(formData, token);
      setSuccess('Étudiant inscrit avec succès ! Vous allez être redirigé.');
      setTimeout(() => navigate('/students'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || "Erreur de création.");
      setLoading(false);
    }
  };
  
  const formVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <FaUserGraduate className="text-4xl text-gray-600 mr-3" />
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Inscrire un Nouvel Étudiant
          </Typography>
          <Typography color="text.secondary">
            Ce formulaire crée le profil de l'étudiant et son compte de connexion.
          </Typography>
        </Box>
      </Box>
      
      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Box component="form" onSubmit={handleCreate}>
          <motion.div variants={formVariants} initial="hidden" animate="visible">
            <Typography variant="h6" gutterBottom>Informations du Profil</Typography>
            <motion.div variants={fieldVariants}><TextField name="firstName" label="Prénom" value={formData.firstName} onChange={handleChange} required fullWidth margin="normal" /></motion.div>
            <motion.div variants={fieldVariants}><TextField name="lastName" label="Nom" value={formData.lastName} onChange={handleChange} required fullWidth margin="normal" /></motion.div>
            <motion.div variants={fieldVariants}><TextField name="dateOfBirth" label="Date de Naissance" type="date" value={formData.dateOfBirth} onChange={handleChange} required fullWidth margin="normal" InputLabelProps={{ shrink: true }} /></motion.div>
            <motion.div variants={fieldVariants}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Classe</InputLabel>
                <Select name="class" value={formData.class} label="Classe" onChange={handleChange}>
                  <MenuItem value=""><em>Non assigné</em></MenuItem>
                  {classes.map((cls) => (<MenuItem key={cls._id} value={cls._id}>{cls.name}</MenuItem>))}
                </Select>
              </FormControl>
            </motion.div>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>Informations de Connexion</Typography>
            <motion.div variants={fieldVariants}><TextField name="email" label="Email de l'étudiant" type="email" value={formData.email} onChange={handleChange} required fullWidth margin="normal" /></motion.div>
            <motion.div variants={fieldVariants}><TextField name="password" label="Mot de passe initial" type="password" value={formData.password} onChange={handleChange} required fullWidth margin="normal" /></motion.div>
            
            <motion.div variants={fieldVariants}>
              <Box sx={{ position: 'relative', mt: 3 }}>
                <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ py: 1.5 }}>
                  Inscrire l'Étudiant
                </Button>
                {loading && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' }} />}
              </Box>
            </motion.div>
          </motion.div>
        </Box>
      </Paper>

      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Container>
  );
};

export default AddStudentPage;