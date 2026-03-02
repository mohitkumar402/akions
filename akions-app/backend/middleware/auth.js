const jwt = require('jsonwebtoken');
const userService = require('../userService');

// In production, server.js exits if JWT_SECRET is missing; dev fallback only
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-dev-secret';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = async (req, res, next) => {
  try {
    const user = await userService.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin privileges required' });
    }
    next();
  } catch (e) {
    console.error('Admin check error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { authenticateToken, requireAdmin };

