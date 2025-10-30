// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Không có token', expired: true });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // TRƯỚC: decoded.id → undefined
    // SAU: decoded.id hoặc decoded._id
    req.user = { id: decoded.id || decoded._id }; // ĐÚNG
    next();
  } catch (error) {
    console.error('Token error:', error.message);
    res.status(401).json({ success: false, message: 'Token không hợp lệ', expired: true });
  }
};