const authorize = (...roles) => {
  return (req, res, next) => {
    // On suppose que le middleware 'protect' a déjà été exécuté
    // et a ajouté 'req.user' à la requête.
    if (!req.user || !req.user.role) {
      return res.status(403).json({ msg: 'Accès interdit. Rôle non trouvé.' });
    }
    
    // On vérifie si le rôle de l'utilisateur fait partie des rôles autorisés
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Accès interdit. Permissions insuffisantes.' });
    }
    
    // Si tout est bon, on passe à la suite
    next();
  };
};

module.exports = { authorize };