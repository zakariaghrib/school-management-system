import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await authService.register({ name, email, password, role });
      setMessage('Inscription réussie ! Vous allez être redirigé vers la page de connexion.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      const resMessage =
        (err.response?.data?.msg) || err.message || err.toString();
      setError(resMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex overflow-hidden">
        
        {/* Colonne du formulaire */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Créez votre compte.</h1>
            <p className="text-gray-500 mb-8">
              Déjà inscrit ?{' '}
              <Link to="/login" className="text-blue-600 font-semibold">
                Connectez-vous
              </Link>
            </p>

            <form onSubmit={handleRegister} className="space-y-4">
              <TextField id="name" label="Nom complet" value={name} onChange={(e) => setName(e.target.value)} />
              <TextField id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <TextField id="password" label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-600 mb-1">
                  Je suis un(e)
                </label>
                <select 
                  id="role" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="student">Étudiant</option>
                  <option value="teacher">Enseignant</option>
                  <option value="parent">Parent</option>
                </select>
              </div>

              <AnimatePresence>
                {message && <Alert type="success">{message}</Alert>}
                {error && <Alert type="error">{error}</Alert>}
              </AnimatePresence>

              <div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 disabled:bg-blue-400"
                >
                  {loading ? 'Création en cours...' : "S'inscrire"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
        
        {/* Colonne de l'image (cachée sur les petits écrans) */}
        <div className="hidden md:block md:w-1/2">
          <img 
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop" 
            alt="Graduation ceremony"
            className="w-full h-full object-cover"
          />
          {/*  */}
        </div>
      </div>
    </div>
  );
};

// Composants réutilisables pour les champs de texte et les alertes
const TextField = ({ id, label, type = 'text', value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <input 
      type={type} 
      id={id} 
      value={value} 
      onChange={onChange}
      required 
      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  </div>
);

const Alert = ({ type, children }) => (
  <motion.p
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    className={`p-3 rounded-lg font-semibold text-center ${
      type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
    }`}
  >
    {children}
  </motion.p>
);

export default RegisterPage;