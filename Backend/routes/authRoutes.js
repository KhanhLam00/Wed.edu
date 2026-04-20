const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/google-login', authController.googleLogin);
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;