const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const transporter = require("../config/email");
const User = require("../models/User");

class AdminController {
  // === ĐĂNG NHẬP ===
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email, role: "admin" });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res
          .status(401)
          .json({ success: false, message: "Email hoặc mật khẩu không đúng" });
      }

      res.json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address,
          phoneNumber: user.phoneNumber,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  // === ĐĂNG XUẤT ===
  static async logout(req, res) {
    try {
      const userId = req.user.id;
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: "Không có quyền truy cập" });
      }
      await User.updateOne({ _id: userId });
      res.json({ success: true, message: "Đăng xuất thành công" });
    } catch (error) {
      console.error("Logout error:", error.message, error.stack);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  // === LẤY TẤT CẢ USER (ADMIN) ===
  static async getUsers(req, res) {
    try {
      const users = await User.find({});
      res.json({ success: true, users });
    } catch (error) {
      console.error("Get users error:", error.message, error.stack);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  // // === LẤY ĐƠN HÀNG ===
  // static async getOrders(req, res) {
  //   try {
  //     const userId = req.user.id;
  //     if (!userId) {
  //       return res.status(401).json({
  //         success: false,
  //         message: "Không có quyền truy cập",
  //         expired: true,
  //       });
  //     }
  //     const orders = await Order.find({ userId }).populate("items.productId");
  //     res.json({ success: true, orders });
  //   } catch (error) {
  //     console.error("Get orders error:", error.message, error.stack);
  //     res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  //   }
  // }
}

module.exports = AdminController;
