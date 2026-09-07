const express = require('express');
const router = express.Router();
const { loginAdmin, registerAdmin } = require('../controllers/authController');

router.post('/login', loginAdmin);
// For initial setup, we can have a hidden register route or just create the admin manually in DB
router.post('/register', registerAdmin);

module.exports = router;
