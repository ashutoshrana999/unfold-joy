const express = require('express');
const router = express.Router();
const { logClick } = require('../controllers/whatsappClickController');

router.post('/', logClick);

module.exports = router;
