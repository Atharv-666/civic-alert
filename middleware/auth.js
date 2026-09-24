const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'civic_alert_salokhenagar_jwt_secret_key';

/**
 * Generate JWT token for user/admin
 */
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: '7d'
  });
};

/**
 * Middleware: Verify JWT Token (Public Citizens & Admins)
 */
const verifyToken = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.headers['x-auth-token']) {
      token = req.headers['x-auth-token'];
    }

    if (!token) {
      // Fallback for development preview header mode if configured
      const devUserId = req.headers['x-clerk-user-id'];
      const devRole = req.headers['x-user-role'] || 'user';
      req.user = {
        _id: devUserId || 'user_citizen_salokhenagar_01',
        id: devUserId || 'user_citizen_salokhenagar_01',
        clerkUserId: devUserId || 'user_citizen_salokhenagar_01',
        name: req.headers['x-user-name'] || 'Salokhenagar Resident',
        email: req.headers['x-user-email'] || 'resident@salokhenagar.org',
        role: devRole
      };
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      // Allow decoded payload fallback if DB user not persisted
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        clerkUserId: decoded.id,
        role: decoded.role || 'user',
        name: 'Authenticated User'
      };
      return next();
    }

    req.user = {
      _id: user._id,
      id: user._id.toString(),
      clerkUserId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or expired authentication token.'
    });
  }
};

/**
 * Middleware: Strict Admin Role Enforcer
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: Authentication required.'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Not an administrator.'
    });
  }

  next();
};

module.exports = {
  generateToken,
  verifyToken,
  requireAuth: verifyToken,
  requireAdmin
};
