// backend/routes/Order.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { protect } = require('../middleware/auth');

router.use(protect);
// GET: LẤY DANH SÁCH ĐƠN HÀNG CỦA USER
router.get('/', protect, AuthController.getOrders);

module.exports = router;