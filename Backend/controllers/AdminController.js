// backend/controllers/AdminAuthController.js  (MỚI)
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Order = require("../models/Order");

class AdminAuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Thiếu thông tin" });
      }

      const admin = await User.findOne({ email, role: "admin" }).select(
        "+password"
      );
      if (!admin || !(await bcrypt.compare(password, admin.password))) {
        return res
          .status(401)
          .json({ success: false, message: "Sai email hoặc mật khẩu" });
      }

      // DÙNG SECRET RIÊNG CHO ADMIN (QUAN TRỌNG NHẤT!)
      const accessToken = jwt.sign(
        { id: admin._id, role: "admin" },
        process.env.ADMIN_JWT_SECRET, // <-- SECRET RIÊNG!
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { id: admin._id },
        process.env.ADMIN_JWT_REFRESH_SECRET, // <-- REFRESH RIÊNG!
        { expiresIn: "7d" }
      );

      admin.refreshToken = await bcrypt.hash(refreshToken, 10);
      await admin.save();

      // Cookie riêng cho admin
      res.cookie("admin_rt", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/api/admin", // chỉ dùng cho admin
      });

      res.json({
        success: true,
        message: "Admin đăng nhập thành công",
        accessToken,
        user: {
          id: admin._id,
          email: admin.email,
          fullName: admin.fullName,
          role: "admin",
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  static async refreshToken(req, res) {
    const token = req.cookies.admin_rt;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Chưa đăng nhập admin" });

    try {
      const decoded = jwt.verify(token, process.env.ADMIN_JWT_REFRESH_SECRET);
      const admin = await User.findById(decoded.id);
      if (!admin || !(await bcrypt.compare(token, admin.refreshToken))) {
        return res.status(401).json({ success: false });
      }

      const newAccessToken = jwt.sign(
        { id: admin._id, role: "admin" },
        process.env.ADMIN_JWT_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ success: true, accessToken: newAccessToken });
    } catch (error) {
      res.status(401).json({ success: false });
    }
  }

  static async logout(req, res) {
    res.clearCookie("admin_rt", { path: "/api/admin" });
    if (req.user) {
      await User.updateOne(
        { _id: req.user.id },
        { $unset: { refreshToken: 1 } }
      );
    }
    res.json({ success: true, message: "Admin đăng xuất thành công" });
  }

  // === LẤY USER HIỆN TẠI ===
  static async getCurrentAdmin(req, res) {
    try {
      // req.user được gán bởi middleware `auth`
      const userId = req.user.id;
      const user = await User.findById(userId).select(
        "-password -refreshToken"
      );

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy người dùng" });
      }

      res.json({
        success: true,
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          address: user.address,
        },
      });
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  // === LẤY TẤT CẢ USER (ADMIN) ===
  static async getUsersAllAdmin(req, res) {
    try {
      const users = await User.find({}, { password: 0, refreshToken: 0 });
      res.json({ success: true, users });
    } catch (error) {
      console.error("Get users error:", error.message, error.stack);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }
  // === LẤY TẤT CẢ Order (ADMIN) ===
  // static async getOrdersAllAdmin(req, res) {
  //   try {
  //     const orders = await Order.find({})
  //       .populate("items.productId", "name image price discountPrice")
  //       .sort({ createdAt: -1 });

  //     res.json({ success: true, orders });
  //   } catch (error) {
  //     res.status(500).json({ success: false, message: error.message });
  //   }
  // }
}

module.exports = AdminAuthController;
