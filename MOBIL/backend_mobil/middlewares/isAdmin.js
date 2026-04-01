function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Admin jogosultság szükséges'
    });
  }
  next();
}

module.exports = isAdmin;
