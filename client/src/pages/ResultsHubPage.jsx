import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import classService from '../services/classService';
import { AuthContext } from '../context/AuthContext';
import {
  Container, Typography, Box, Grid, Paper,
  CircularProgress, Alert
} from '@mui/material';
import { FaPoll, FaUsers, FaChalkboardTeacher } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ResultsHubPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setLoading(true);
      classService.getAllClasses(token)
        .then(response => setClasses(response.data))
        .catch(() => setError("Erreur de chargement des classes."))
        .finally(() => setLoading(false));
    }
  }, [token]);

  const handleClassSelect = (classId) => {
    navigate(`/classes/${classId}/results`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <FaPoll className="text-4xl text-gray-600 mr-3" />
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Centre de Consultation des Résultats
          </Typography>
          <Typography color="text.secondary">
            Veuillez sélectionner une classe pour générer son bulletin de notes.
          </Typography>
        </Box>
      </Box>

      {loading && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Grid container spacing={3}>
            {classes.length > 0 ? (
              classes.map(cls => (
                <Grid item key={cls._id} xs={12} sm={6} md={4}>
                  <motion.div variants={cardVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                    <Paper
                      onClick={() => handleClassSelect(cls._id)}
                      sx={{
                        p: 3,
                        borderRadius: 4,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                        borderTop: '4px solid #3182ce', // Accent bleu
                      }}
                    >
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        {cls.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Année: {cls.year}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 1 }}>
                        <FaChalkboardTeacher style={{ marginRight: '8px' }} />
                        <Typography variant="body2">
                          Prof. Principal: {cls.mainTeacher ? `${cls.mainTeacher.firstName} ${cls.mainTeacher.lastName}` : 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <FaUsers style={{ marginRight: '8px' }} />
                        <Typography variant="body2">
                          {cls.students.length} Étudiant(s)
                        </Typography>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography sx={{ textAlign: 'center', mt: 4 }}>Aucune classe trouvée.</Typography>
              </Grid>
            )}
          </Grid>
        </motion.div>
      )}
    </Container>
  );
};

export default ResultsHubPage;