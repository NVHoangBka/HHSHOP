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

      const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign(
        { email: user.email },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

      await User.updateOne(
        { _id: user._id },
        { refreshToken: hashedRefreshToken }
      );

      res.json({
        success: true,
        accessToken,
        refreshToken,
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

  // === REFRESH TOKEN ===
  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res
          .status(401)
          .json({ success: false, message: "Không có refresh token" });
      }

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findOne({ email: decoded.email });
      if (!user || !(await bcrypt.compare(refreshToken, user.refreshToken))) {
        return res
          .status(401)
          .json({ success: false, message: "Refresh token không hợp lệ" });
      }

      const newAccessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      const newRefreshToken = jwt.sign(
        { email: user.email },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );
      const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);

      await User.updateOne(
        { _id: user._id },
        { refreshToken: hashedNewRefreshToken }
      );

      res.json({
        success: true,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      console.error("Refresh token error:", error.message, error.stack);
      res.status(401).json({
        success: false,
        message: "Refresh token không hợp lệ hoặc đã hết hạn",
      });
    }
  }

  // === QUÊN MẬT KHẨU SIÊU AN TOÀN ===
  static async forgotPassword(req, res) {
    try {
      const email = req.body.email;
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập email!",
        });
      }

      const user = await User.findOne({ email });

      // Luôn trả success để không lộ email tồn tại
      if (!user) {
        return res.json({
          success: true,
          message: "Nếu email tồn tại, link đặt lại đã được gửi!",
        });
      }

      // Tạo token + hết hạn 10 phút
      const token = jwt.sign({ id: user._id }, process.env.JWT_RESET_SECRET, {
        expiresIn: "10m",
      });

      // Lưu vào DB
      user.resetToken = token;
      user.resetTokenExpires = Date.now() + 10 * 60 * 1000;
      await user.save();

      // Gửi link QUA EMAIL
      const resetUrl = `http://localhost:3000/account/reset-password/${token}`;

      const mailOptions = {
        from: process.env.EMAIL_USER || "no-reply@hhshop.com",
        to: email,
        subject: "Đặt lại mật khẩu – HHSHOP (10 phút)",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
            <h2 style="color: #dc3545;">YÊU CẦU ĐẶT LẠI MẬT KHẨU</h2>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản:</p>
            <h3><strong>${email}</strong></h3>
            <p>Nhấn nút bên dưới để đặt lại (chỉ hiệu lực <strong>10 phút</strong>):</p>
            <a href="${resetUrl}" style="background:#28a745;color:white;padding:15px 30px;text-decoration:none;border-radius:5px;font-weight:bold;">
              ĐẶT LẠI MẬT KHẨU
            </a>
            <p style="color: red; margin-top: 20px;">
              Nếu bạn <strong>không yêu cầu</strong>, vui lòng bỏ qua email này.
            </p>
          </div>
        `,
      };

      // GỬI EMAIL + BẮT LỖI CHI TIẾT
      await transporter.sendMail(mailOptions);
      console.log("ĐÃ GỬI EMAIL KHÔI PHỤC đến:", email);

      res.json({
        success: true,
        message: "Link đặt lại đã được gửi (nếu email tồn tại)!",
      });
    } catch (error) {
      // LOG RÕ LỖI ĐỂ BIẾT CHUYỆN GÌ XẢY RA
      console.error("LỖI GỬI EMAIL KHÔI PHỤC:", error.message);
      console.error("Chi tiết lỗi:", error);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  // === ĐẶT LẠI MẬT KHẨU TỪ LINK ===
  static async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;
      if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: "Mật khẩu phải ít nhất 8 ký tự",
        });
      }

      const user = await User.findOne({
        resetToken: token,
        resetTokenExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Link đã hết hạn hoặc không hợp lệ!",
        });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      user.resetToken = null;
      user.resetTokenExpires = null;
      await user.save();

      res.json({
        success: true,
        message: "Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.",
      });
    } catch (error) {
      console.error("Reset password error:", error.message, error.stack);
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
      await User.updateOne({ _id: userId }, { refreshToken: null });
      res.json({ success: true, message: "Đăng xuất thành công" });
    } catch (error) {
      console.error("Logout error:", error.message, error.stack);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  // === LẤY TẤT CẢ USER (ADMIN) ===
  static async getUsers(req, res) {
    try {
      const users = await User.find({}, { password: 0, refreshToken: 0 });
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
