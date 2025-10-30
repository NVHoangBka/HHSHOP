// backend/routes/Address.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const auth = require('../middleware/auth');

// SỬA: DÙNG '/' VÀ TRUYỀN HÀM (KHÔNG GỌI NGAY)
router.get('/', auth, AuthController.getAddresses);

module.exports = router;