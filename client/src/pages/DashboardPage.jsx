import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Container, Typography, Box, Paper } from '@mui/material';

// Style pour les cartes de navigation
const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  margin: '8px',
  textAlign: 'center',
  width: '220px',
  display: 'inline-block',
  textDecoration: 'none',
  color: 'inherit',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  verticalAlign: 'top',
  minHeight: '120px'
};

const DashboardPage = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tableau de Bord
        </Typography>
        <Typography>
          Bienvenue ! Votre rôle est : <strong>{user.role}</strong>.
        </Typography>
      </Box>
      
      <hr />
      
      <Typography variant="h5" sx={{ mt: 4 }}>Accès Rapide</Typography>
      
      <Box sx={{ mt: 2 }}>
        {/* Liens pour les admins et les enseignants */}
        {(user.role === 'admin' || user.role === 'teacher') && (
          <>
            <Paper component={Link} to="/grades/entry" sx={cardStyle}>
              <Typography variant="h6">Saisie des Notes</Typography>
              <Typography variant="body2">Choisir une classe pour ajouter des notes.</Typography>
            </Paper>

            <Paper component={Link} to="/results" sx={cardStyle}>
              <Typography variant="h6">Consultation des Résultats</Typography>
              <Typography variant="body2">Générer les bulletins par classe.</Typography>
            </Paper>
          </>
        )}

        {/* Liens pour les admins seulement */}
        {user.role === 'admin' && (
          <>
            <Paper component={Link} to="/students" sx={cardStyle}>
              <Typography variant="h6">Gestion des Étudiants</Typography>
              <Typography variant="body2">Voir et gérer les listes d'étudiants.</Typography>
            </Paper>

            <Paper component={Link} to="/teachers" sx={cardStyle}>
              <Typography variant="h6">Gestion des Enseignants</Typography>
              <Typography variant="body2">Ajouter et gérer les enseignants.</Typography>
            </Paper>
            
            <Paper component={Link} to="/classes" sx={cardStyle}>
              <Typography variant="h6">Gestion des Classes</Typography>
              <Typography variant="body2">Organiser les classes et les effectifs.</Typography>
            </Paper>
          </>
        )}
      </Box>
    </Container>
  );
};

export default DashboardPage;