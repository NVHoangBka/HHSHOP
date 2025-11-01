// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // BẮT BUỘC

const protect = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  // 1. KIỂM TRA HEADER
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Không có token, vui lòng đăng nhập',
      expired: true
    });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // 2. XÁC MINH TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. LẤY USER TỪ DB (BẢO MẬT)
    const user = await User.findById(decoded.id || decoded._id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Người dùng không tồn tại',
        expired: true
      });
    }

    // 4. GẮN USER ĐẦY ĐỦ VÀO req
    req.user = user;
    next();
  } catch (error) {
    console.error('Token error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn',
      expired: true
    });
  }
};

// XUẤT THEO TÊN
module.exports = { protect };