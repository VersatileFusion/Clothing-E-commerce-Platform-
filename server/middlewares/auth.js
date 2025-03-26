const jwt = require('jsonwebtoken');
const User = require('../models/User');

console.log('Initializing auth middleware...');

// Protect routes
exports.protect = async (req, res, next) => {
  console.log('Running protect middleware...');
  let token;

  // Get token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    console.log('Bearer token found in authorization header');
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }
  // Get token from cookie
  else if (req.cookies.token) {
    console.log('Token found in cookies');
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    console.log('No token provided, authorization denied');
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route',
    });
  }

  try {
    // Verify token
    console.log('Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`Token verified for user: ${decoded.id}`);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('User no longer exists in the database');
      return res.status(401).json({
        success: false,
        error: 'User no longer exists',
      });
    }

    // Add user to request object
    req.user = user;
    console.log('User authenticated successfully');
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route',
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log(`Checking role authorization for: ${req.user.role}`);
    console.log(`Required roles: ${roles.join(', ')}`);
    
    if (!roles.includes(req.user.role)) {
      console.log(`User role ${req.user.role} not authorized to access this route`);
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    
    console.log('Role authorization successful');
    next();
  };
};

console.log('Auth middleware initialized');

// For testing purposes
exports.testMiddleware = (req, res, next) => {
  console.log('Test middleware running');
  next();
}; 