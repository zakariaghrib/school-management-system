import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Style simple pour les cartes de navigation
const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '16px',
  margin: '16px',
  textAlign: 'center',
  width: '200px',
  display: 'inline-block',
  textDecoration: 'none',
  color: 'black',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const DashboardPage = () => {
  const { user } = useContext(AuthContext);

  // Affiche un message de chargement tant que le contexte utilisateur n'est pas prêt
  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>Tableau de Bord</h1>
      <p>
        Bienvenue ! Votre rôle est : <strong>{user.role}</strong>.
      </p>
      
      <hr />
      
      <h3>Accès Rapide</h3>

      {/* Liens visibles par tous les utilisateurs connectés */}
      {/* <Link to="/profile" style={cardStyle}>Mon Profil</Link> */}

      {/* Liens visibles uniquement par les admins et les enseignants */}
      {(user.role === 'admin' || user.role === 'teacher') && (
        <Link to="/students" style={cardStyle}>
          <h4>Gestion des Étudiants</h4>
          <p>Voir et gérer les listes d'étudiants.</p>
        </Link>
      )}

      {/* Liens visibles uniquement par les admins */}
      {user.role === 'admin' && (
        <>
          <Link to="/teachers" style={cardStyle}>
            <h4>Gestion des Enseignants</h4>
            <p>Ajouter et gérer les enseignants.</p>
          </Link>
          <Link to="/classes" style={cardStyle}>
            <h4>Gestion des Classes</h4>
            <p>Organiser les classes et les effectifs.</p>
          </Link>
        </>
      )}
      
      {/* Message pour les rôles avec moins de permissions */}
      {(user.role === 'student' || user.role === 'parent') && (
          <div style={{marginTop: '2rem'}}>
              <p>Votre espace personnel est en cours de construction.</p>
          </div>
      )}

    </div>
  );
};

export default DashboardPage;