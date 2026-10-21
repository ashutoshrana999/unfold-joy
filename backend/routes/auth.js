const express = require('express');
const router = express.Router();
const { loginAdmin, registerAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/security');

// Brute-force protected login
router.post('/login', loginLimiter, loginAdmin);

// Admin creation is restricted: only authenticated administrators can create other admins
router.post('/register', protect, registerAdmin);

// Token verification route
router.get('/verify', protect, (req, res) => {
  res.json({
    valid: true,
    admin: {
      _id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email
    }
  });
});

module.exports = router;
