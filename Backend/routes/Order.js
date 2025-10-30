// backend/routes/Order.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const auth = require('../middleware/auth');

// GET: LẤY DANH SÁCH ĐƠN HÀNG CỦA USER
router.get('/', auth, AuthController.getOrders);

module.exports = router;