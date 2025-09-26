import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/dashboard" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
          Gestion École
        </Typography>
        {user ? (
          <>
            <Typography sx={{ mr: 2 }}>Bonjour, {user.name}</Typography>
            <Button color="inherit" onClick={handleLogout}>Déconnexion</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">Connexion</Button>
            <Button color="inherit" component={Link} to="/register">Inscription</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
