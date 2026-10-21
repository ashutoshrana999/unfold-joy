const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'supersecretjwtkey';
    const decoded = jwt.verify(token, secret);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Not authorized, invalid token payload' });
    }

    const admin = await Admin.findById(decoded.id).select('-passwordHash');
    if (!admin) {
      return res.status(401).json({ message: 'Not authorized, administrator account not found' });
    }

    req.admin = admin;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

module.exports = { protect };
