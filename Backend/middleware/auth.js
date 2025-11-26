// backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Blacklist token (tạm dùng Set – sau này thay Redis nếu cần)
const tokenBlacklist = new Set();

const protect = async (req, res, next) => {
  let token;

  // Lấy token từ header hoặc cookie
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Không có quyền truy cập – Vui lòng đăng nhập",
      expired: true,
    });
  }

  // Kiểm tra blacklist
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({
      success: false,
      message: "Phiên đăng nhập đã hết hạn",
      expired: true,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id || decoded._id).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Tài khoản không tồn tại",
        expired: true,
      });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({ success: false, message: "Tài khoản đã bị khóa" });
    }

    req.user = user;
    req.token = token; // để logout dùng
    next();
  } catch (error) {
    console.error("Token error:", error.message);
    return res.status(401).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Phiên đăng nhập hết hạn"
          : "Token không hợp lệ",
      expired: true,
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ success: false, message: "Chỉ Admin mới được phép!" });
  }
};

// Thêm token vào blacklist (tự động xóa sau 15 phút)
const addToBlacklist = (token) => {
  if (token && !tokenBlacklist.has(token)) {
    tokenBlacklist.add(token);
    setTimeout(() => tokenBlacklist.delete(token), 15 * 60 * 1000); // 15 phút
  }
};

module.exports = {
  protect,
  adminOnly,
  addToBlacklist,
};
