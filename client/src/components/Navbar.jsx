import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '1rem', background: '#eee', marginBottom: '1rem' }}>
      <Link to={user ? "/dashboard" : "/login"} style={{ marginRight: '1rem' }}>
        Gestion École
      </Link>
      {user ? (
        <button onClick={handleLogout}>Déconnexion</button>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: '1rem' }}>Connexion</Link>
          <Link to="/register">Inscription</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;