const { verifyToken } = require('../auth/jwt.js');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const payload = verifyToken(token);
      req.userId = payload.userId;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Unauthorized' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = { authenticate };
