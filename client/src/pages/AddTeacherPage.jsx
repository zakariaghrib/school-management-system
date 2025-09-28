import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import teacherService from '../services/teacherService';
import subjectService from '../services/subjectService';
import { AuthContext } from '../context/AuthContext';
import {
  Container, Typography, Box, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, OutlinedInput,
  Chip, Paper, CircularProgress, Alert, Divider
} from '@mui/material';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AddTeacherPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    subjects: [],
  });
  const [allSubjects, setAllSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      subjectService.getAllSubjects(token)
        .then(res => setAllSubjects(res.data))
        .catch(() => setError('Erreur de chargement des matières.'));
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubjectChange = (event) => {
    const { target: { value } } = event;
    setFormData(prev => ({
      ...prev,
      subjects: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await teacherService.createTeacher(formData, token);
      setSuccess('Enseignant ajouté avec succès ! Vous allez être redirigé.');
      setTimeout(() => navigate('/teachers'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || "Erreur lors de la création.");
      setLoading(false);
    }
  };

  const formVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const fieldVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <FaChalkboardTeacher className="text-4xl text-gray-600 mr-3" />
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Inscrire un Nouvel Enseignant
          </Typography>
          <Typography color="text.secondary">
            Ce formulaire crée le profil et le compte de connexion de l'enseignant.
          </Typography>
        </Box>
      </Box>
      
      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Box component="form" onSubmit={handleCreate}>
          <motion.div variants={formVariants} initial="hidden" animate="visible">
            <Typography variant="h6" gutterBottom>Informations du Profil</Typography>
            <motion.div variants={fieldVariants}><TextField name="firstName" label="Prénom" value={formData.firstName} onChange={handleChange} required fullWidth margin="normal" /></motion.div>
            <motion.div variants={fieldVariants}><TextField name="lastName" label="Nom" value={formData.lastName} onChange={handleChange} required fullWidth margin="normal" /></motion.div>
            <motion.div variants={fieldVariants}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Matières enseignées</InputLabel>
                <Select
                  multiple
                  name="subjects"
                  value={formData.subjects}
                  onChange={handleSubjectChange}
                  input={<OutlinedInput label="Matières enseignées" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const subject = allSubjects.find(s => s._id === value);
                        return <Chip key={value} label={subject ? subject.name : ''} />;
                      })}
                    </Box>
                  )}
                >
                  {allSubjects.map((subject) => (
                    <MenuItem key={subject._id} value={subject._id}>{subject.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </motion.div>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>Informations de Connexion</Typography>
            <motion.div variants={fieldVariants}><TextField name="email" label="Email de l'enseignant" type="email" value={formData.email} onChange={handleChange} required fullWidth margin="normal" /></motion.div>
            {/* CHAMP MOT DE PASSE AJOUTÉ */}
            <motion.div variants={fieldVariants}><TextField name="password" label="Mot de passe initial" type="password" value={formData.password} onChange={handleChange} required fullWidth margin="normal" /></motion.div>

            <motion.div variants={fieldVariants}>
              <Box sx={{ position: 'relative', mt: 3 }}>
                <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ py: 1.5 }}>
                  Inscrire l'Enseignant
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

export default AddTeacherPage;