import React, { useState, useEffect, useContext } from 'react';
import userService from '../services/userService';
import { AuthContext } from '../context/AuthContext';
import { 
  Container, Typography, Box, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, IconButton, Chip 
} from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const { token } = useContext(AuthContext); // Utiliser le token

  const loadUsers = () => {
    if (token) {
      userService.getAllUsers(token) // Passer le token
        .then(response => setUsers(response.data))
        .catch(() => setMessage("Erreur de chargement des utilisateurs."));
    }
  };

  useEffect(() => {
    loadUsers();
  }, [token]);

  const handleResetPassword = async (userId, userName) => {
    const newPassword = prompt(`Entrez le nouveau mot de passe pour ${userName}:`);
    if (newPassword && newPassword.length >= 6) {
      try {
        await userService.resetPassword(userId, newPassword, token); // Passer le token
        alert('Le mot de passe a été réinitialisé avec succès !');
      } catch (error) {
        alert(error.response?.data?.msg || "Erreur de réinitialisation.");
      }
    } else if (newPassword) {
      alert('Le mot de passe doit contenir au moins 6 caractères.');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4">Gestion des Comptes Utilisateurs</Typography>
      </Box>

      {message && <Typography color="error">{message}</Typography>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u._id} hover>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={u.role} 
                    color={u.role === 'teacher' ? 'primary' : 'secondary'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    title="Réinitialiser le mot de passe" 
                    color="warning" 
                    onClick={() => handleResetPassword(u._id, u.name)}
                  >
                    <VpnKeyIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default UserListPage;