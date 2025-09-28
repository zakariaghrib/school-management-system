import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary' }}>
      <Toolbar>
        {/* --- Logo et Titre --- */}
        <SchoolIcon sx={{ color: 'primary.main', mr: 1 }} />
        <Typography 
          variant="h6" 
          component={Link} 
          to="/dashboard" 
          sx={{ 
            flexGrow: 1, 
            color: 'inherit', 
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          Gestion École
        </Typography>

        {/* --- Boutons Utilisateur --- */}
        {user ? (
          <Box>
            <Button 
              color="inherit"
              onClick={handleMenu}
              startIcon={<AccountCircle />}
            >
              {user.name}
            </Button>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box>
            <Button 
              color="inherit" 
              component={Link} 
              to="/login"
              sx={{ fontWeight: 'medium' }}
            >
              Connexion
            </Button>
            <Button 
              variant="contained"
              component={Link} 
              to="/register"
              disableElevation
              sx={{ ml: 2 }}
            >
              Inscription
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;