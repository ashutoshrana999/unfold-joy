const express = require('express');
const router = express.Router();
const { logClick } = require('../controllers/whatsappClickController');
const { clickLimiter } = require('../middleware/security');

router.post('/', clickLimiter, logClick);

module.exports = router;
