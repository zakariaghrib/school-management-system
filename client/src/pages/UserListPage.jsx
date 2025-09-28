import React, { useState, useEffect, useContext } from 'react';
import userService from '../services/userService';
import { AuthContext } from '../context/AuthContext';
import {
  Container, Typography, Box, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton, Chip,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, TextField
} from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const { token } = useContext(AuthContext);

  const loadUsers = () => {
    if (token) {
      setLoading(true);
      userService.getAllUsers(token)
        .then(response => setUsers(response.data))
        .catch(() => setError("Erreur de chargement des utilisateurs."))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadUsers();
  }, [token]);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
    setNewPassword('');
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmReset = async () => {
    if (newPassword.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    try {
      await userService.resetPassword(selectedUser._id, newPassword, token);
      alert(`Le mot de passe pour ${selectedUser.name} a été réinitialisé avec succès !`);
      handleCloseModal();
    } catch (err) {
      alert(err.response?.data?.msg || "Erreur de réinitialisation.");
    }
  };

  const roleColors = {
    admin: 'error',
    teacher: 'primary',
    student: 'secondary',
    parent: 'success',
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <FaUsers className="text-4xl text-gray-600 mr-3" />
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Gestion des Utilisateurs
          </Typography>
          <Typography color="text.secondary">
            Consulter et gérer les comptes de l'application.
          </Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Nom</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Rôle</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} align="center"><CircularProgress /></TableCell></TableRow>
              ) : (
                users.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    style={{ display: 'table-row' }}
                  >
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role} 
                        color={roleColors[user.role] || 'default'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        title="Réinitialiser le mot de passe" 
                        color="warning" 
                        onClick={() => handleOpenModal(user)}
                      >
                        <VpnKeyIcon />
                      </IconButton>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* --- MODAL DE RÉINITIALISATION --- */}
      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>Réinitialiser le mot de passe pour <strong>{selectedUser?.name}</strong></DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nouveau mot de passe"
            type="password"
            fullWidth
            variant="standard"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Annuler</Button>
          <Button onClick={handleConfirmReset} variant="contained">Réinitialiser</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserListPage;