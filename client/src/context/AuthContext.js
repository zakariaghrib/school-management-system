import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Au chargement de l'app, on vérifie si un utilisateur et un token sont déjà dans le localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // Fin du chargement
  }, [token]);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    if (response.data) {
      // On sauvegarde l'objet user complet et le token dans le localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      
      // On met à jour l'état de l'application
      setUser(response.data.user);
      setToken(response.data.token);
    }
    return response;
  };

  const logout = () => {
    // On vide le localStorage et les états
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
  };

  // On n'affiche l'application que lorsque le chargement initial est terminé
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

