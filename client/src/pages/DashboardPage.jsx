import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';

// Style pour les cartes de navigation
const cardStyle = {
  p: 2,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: 140,
  textDecoration: 'none',
  color: 'inherit',
  transition: 'box-shadow 0.3s',
  '&:hover': {
    boxShadow: 6,
  },
};

const DashboardPage = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Tableau de Bord
      </Typography>
      <Typography>
        Bienvenue ! Votre rôle est : <strong>{user.role}</strong>.
      </Typography>
      <hr style={{ margin: '20px 0' }}/>
      
      <Grid container spacing={3}>
        {/* Cartes pour Admins et Enseignants */}
        {(user.role === 'admin' || user.role === 'teacher') && (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <Paper component={Link} to="/grades/entry" sx={cardStyle} elevation={3}>
                <Typography variant="h6">Saisie des Notes</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Choisir une classe pour ajouter des notes.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper component={Link} to="/results" sx={cardStyle} elevation={3}>
                <Typography variant="h6">Consultation des Résultats</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Générer les bulletins par classe.</Typography>
              </Paper>
            </Grid>
          </>
        )}

        {/* Cartes pour Admins seulement */}
        {user.role === 'admin' && (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <Paper component={Link} to="/students" sx={cardStyle} elevation={3}>
                <Typography variant="h6">Gestion des Étudiants</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Voir et gérer les listes d'étudiants.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper component={Link} to="/teachers" sx={cardStyle} elevation={3}>
                <Typography variant="h6">Gestion des Enseignants</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Ajouter et gérer les enseignants.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper component={Link} to="/classes" sx={cardStyle} elevation={3}>
                <Typography variant="h6">Gestion des Classes</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Organiser les classes et les effectifs.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper component={Link} to="/subjects" sx={cardStyle} elevation={3}>
                <Typography variant="h6">Gestion des Matières</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Ajouter et supprimer des matières.</Typography>
              </Paper>
            </Grid>
            {/* --- NOUVELLE CARTE AJOUTÉE ICI --- */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper component={Link} to="/users" sx={cardStyle} elevation={3}>
                <Typography variant="h6">Gestion des Utilisateurs</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Réinitialiser les mots de passe.</Typography>
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
};

export default DashboardPage;

