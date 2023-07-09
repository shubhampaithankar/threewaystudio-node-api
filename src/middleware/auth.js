const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    const decoded = verifyToken(token)
    req.user = decoded;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const verifyToken = (token) => {
  try {
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return null;
  }
}

module.exports = { authenticateToken, verifyToken }
