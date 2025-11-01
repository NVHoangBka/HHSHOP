const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController')
const { protect } = require('../middleware/auth');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);
router.get('/me', protect, AuthController.getCurrentUser);
router.post('/logout', protect, AuthController.logout);
router.get('/users', protect, AuthController.getUsers);

module.exports = router;