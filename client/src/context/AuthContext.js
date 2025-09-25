// client/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // <-- Assurez-vous que c'est importé
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = jwtDecode(token);
      setUser({ token, ...decodedUser.user }); // <-- Stocke l'id et le rôle
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
    const response = await authService.login(userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      const decodedUser = jwtDecode(response.data.token);
      setUser({ token: response.data.token, ...decodedUser.user }); // <-- Stocke l'id et le rôle
    }
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};