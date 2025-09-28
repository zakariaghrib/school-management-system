import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Container, Typography, Box, Grid } from '@mui/material';
import { motion } from 'framer-motion';

// Importation des icônes
import { FaUserGraduate, FaChalkboardTeacher, FaSchool, FaBook, FaClipboardList, FaPoll, FaUserCog, FaFileSignature } from 'react-icons/fa';

// --- Composant de carte réutilisable ---
const DashboardCard = ({ to, icon, title, description, color }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <motion.div variants={cardVariants}>
        <Link to={to} style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 4,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              height: 160,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 8px 20px rgba(128, 90, 213, 0.2)`, // Ombre violette
              },
            }}
          >
            <Box sx={{ color: color, fontSize: '2.5rem' }}>{icon}</Box>
            <Box>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Box>
          </Box>
        </Link>
      </motion.div>
    </Grid>
  );
};

// --- Composant principal du tableau de bord ---
const DashboardPage = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>Chargement...</Box>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Apparition des cartes en décalé
      },
    },
  };

  return (
    <Box sx={{ bgcolor: '#f4f7f9', minHeight: 'calc(100vh - 64px)' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, p: 3, bgcolor: 'white', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Tableau de Bord
          </Typography>
          <Typography color="text.secondary">
            Bienvenue, {user.name} ! Votre rôle est : <strong>{user.role}</strong>.
          </Typography>
        </Box>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            {/* Cartes pour Admin et Enseignant */}
            {(user.role === 'admin' || user.role === 'teacher') && (
              <>
                <DashboardCard to="/grades/entry" icon={<FaClipboardList />} title="Saisie des Notes" description="Ajouter ou modifier des notes." color="#805ad5" />
                <DashboardCard to="/results" icon={<FaPoll />} title="Consultation des Résultats" description="Générer les bulletins de classe." color="#3182ce" />
              </>
            )}

            {/* Cartes pour Admin seulement */}
            {user.role === 'admin' && (
              <>
                <DashboardCard to="/students" icon={<FaUserGraduate />} title="Gestion Étudiants" description="Gérer les profils étudiants." color="#dd6b20" />
                <DashboardCard to="/teachers" icon={<FaChalkboardTeacher />} title="Gestion Enseignants" description="Gérer les profils enseignants." color="#38a169" />
                <DashboardCard to="/classes" icon={<FaSchool />} title="Gestion Classes" description="Organiser les classes." color="#d53f8c" />
                <DashboardCard to="/subjects" icon={<FaBook />} title="Gestion Matières" description="Gérer les matières de l'école." color="#059669" />
                <DashboardCard to="/users" icon={<FaUserCog />} title="Gestion Utilisateurs" description="Réinitialiser les mots de passe." color="#718096" />
              </>
            )}

            {/* Carte pour Étudiant seulement */}
            {user.role === 'student' && (
              <DashboardCard to="/my-results" icon={<FaFileSignature />} title="Mes Résultats" description="Consulter mon bulletin." color="#805ad5" />
            )}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default DashboardPage;