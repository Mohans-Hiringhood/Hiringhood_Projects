const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Role-based access control
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.status(403).json({ message: 'Not authorized for this action' });
    }
    next();
  };
};