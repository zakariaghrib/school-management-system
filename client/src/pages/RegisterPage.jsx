import React, { useState } from 'react';
import authService from '../services/authService';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await authService.register({ name, email, password, role });
      setMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    } catch (error) {
      const resMessage =
        (error.response && error.response.data && error.response.data.msg) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
    }
  };

  return (
    <div>
      <h2>Inscription</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="name">Nom complet</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password">Mot de passe</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="role">Rôle</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Étudiant</option>
            <option value="teacher">Enseignant</option>
            <option value="parent">Parent</option>
          </select>
        </div>
        <button type="submit">S'inscrire</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterPage;