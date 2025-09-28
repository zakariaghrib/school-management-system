import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import classService from '../services/classService';
import teacherService from '../services/teacherService';
import { AuthContext } from '../context/AuthContext';
import {
  Container, Typography, Box, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Paper,
  CircularProgress, Alert
} from '@mui/material';
import { FaSchool } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AddClassPage = () => {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [mainTeacher, setMainTeacher] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      teacherService.getAllTeachers(token)
        .then(response => setTeachers(response.data))
        .catch(() => setError("Erreur de chargement des enseignants."));
    }
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await classService.createClass({ name, year, mainTeacher }, token);
      setSuccess('Classe créée avec succès ! Vous allez être redirigé.');
      setTimeout(() => navigate('/classes'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || "Erreur lors de la création.");
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
        <FaSchool className="text-4xl text-gray-600 mr-3" />
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Ajouter une Nouvelle Classe
          </Typography>
          <Typography color="text.secondary">
            Remplissez les informations ci-dessous pour créer une classe.
          </Typography>
        </Box>
      </Box>
      
      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <motion.div variants={formVariants} initial="hidden" animate="visible">
          <Box component="form" onSubmit={handleCreate}>
            <motion.div variants={fieldVariants}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Nom de la classe (ex: 6ème A)"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </motion.div>
            <motion.div variants={fieldVariants}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="year"
                label="Année scolaire (ex: 2025-2026)"
                value={year}
                onChange={e => setYear(e.target.value)}
              />
            </motion.div>
            <motion.div variants={fieldVariants}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="teacher-select-label">Professeur Principal</InputLabel>
                <Select
                  labelId="teacher-select-label"
                  value={mainTeacher}
                  label="Professeur Principal"
                  onChange={e => setMainTeacher(e.target.value)}
                >
                  <MenuItem value="">
                    <em>-- Non assigné --</em>
                  </MenuItem>
                  {teachers.map(teacher => (
                    <MenuItem key={teacher._id} value={teacher._id}>
                      {teacher.firstName} {teacher.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </motion.div>
            
            <motion.div variants={fieldVariants}>
              <Box sx={{ position: 'relative', mt: 3 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{ py: 1.5 }}
                >
                  Créer la Classe
                </Button>
                {loading && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' }} />}
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      </Paper>

      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Container>
  );
};

export default AddClassPage;