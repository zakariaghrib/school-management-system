// server/middlewares/authorizationMiddleware.js

const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user est défini par le middleware 'protect' qui s'exécute avant.
    // On vérifie si le rôle de l'utilisateur est inclus dans la liste des rôles autorisés.
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        msg: 'Forbidden: You do not have permission to perform this action' 
      });
    }
    // Si l'utilisateur a le bon rôle, on passe à la suite.
    next();
  };
};

module.exports = { authorize };