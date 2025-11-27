// backend/middleware/adminAuth.js  (MỚI)
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const adminProtect = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Chưa đăng nhập admin" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET); // SECRET RIÊNG!
    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Không có quyền admin" });
    }

    const admin = await User.findById(decoded.id);
    if (!admin) return res.status(401).json({ success: false });

    req.user = admin;
    req.user.role = "admin";
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Token admin không hợp lệ" });
  }
};

module.exports = { adminProtect };
