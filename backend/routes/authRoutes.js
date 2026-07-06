const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Açıq maршrutları
router.post('/register', authController.register);
router.post('/login', authController.login);

// Qorunmuş maршrutları
router.get('/profile', authController.getProfile);

module.exports = router;
