const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const transporter = require("../config/email");
const User = require("../models/User");
const Order = require("../models/Order");
const Address = require("../models/Address");

class AuthController {
  // === ĐĂNG KÝ ===
  static async register(req, res) {
    try {
      // BƯỚC 1: Kiểm tra env (bắt buộc)
      if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
        return res.status(500).json({
          success: false,
          message: "Server thiếu cấu hình JWT",
        });
      }

      const { email, password, firstName, lastName, phoneNumber, address } =
        req.body;

      // BƯỚC 2: Validate cơ bản
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email và password là bắt buộc",
        });
      }

      // BƯỚC 3: Kiểm tra email trùng
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email đã tồn tại",
        });
      }

      // BƯỚC 4: Tạo refreshToken TRƯỚC
      const refreshToken = jwt.sign(
        { email: email.toLowerCase() },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      // BƯỚC 5: Hash password + refreshToken
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

      // BƯỚC 6: Tạo user – ĐẢM BẢO CÓ await!!!
      const newUser = await User.create({
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        address,
        refreshToken: hashedRefreshToken,
      });

      // BƯỚC 7: Tạo accessToken DỰA TRÊN _id THẬT
      const accessToken = jwt.sign(
        { id: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // BƯỚC 8: Thành công!
      return res.status(201).json({
        success: true,
        message: "Đăng ký thành công!",
        userId: newUser._id,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error("LỖI ĐĂNG KÝ CHI TIẾT:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
        error: error.message,
      });
    }
  }

  // === ĐĂNG NHẬP ===
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
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

  // === LẤY USER HIỆN TẠI ===
  static async getCurrentUser(req, res) {
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

  // === LẤY ĐƠN HÀNG ===
  static async getOrders(req, res) {
    try {
      const userId = req.user.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Không có quyền truy cập",
          expired: true,
        });
      }
      const orders = await Order.find({ userId }).populate("items.productId");
      res.json({ success: true, orders });
    } catch (error) {
      console.error("Get orders error:", error.message, error.stack);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  // === ĐỔI MẬT KHẨU ===
  static async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Người dùng không tồn tại" });
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Mật khẩu cũ không đúng" });
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      // user.password = hashedNewPassword;
      await User.updateOne(
        { _id: userId },
        { $set: { password: hashedNewPassword } }
      );
      res.json({ success: true, message: "Đổi mật khẩu thành công" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  // === LẤY ĐỊA CHỈ ===
  static async getAddressAll(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res
          .status(401)
          .json({ success: false, message: "Không có quyền truy cập" });
      }

      const userId = req.user.id;
      const addresses = await Address.find({ userId }).sort({ isDefault: -1 });
      res.json({ success: true, addresses });
    } catch (error) {
      console.error("Lỗi lấy địa chỉ:", error);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  static async addAddress(req, res) {
    try {
      const userId = req.user.id;
      const {
        recipientName,
        phoneNumber,
        addressLine,
        ward,
        district,
        city,
        isDefault,
      } = req.body;

      // Nếu là mặc định → bỏ mặc định cũ
      if (isDefault) {
        await Address.updateMany({ userId }, { isDefault: false });
      }
      const newAddress = await Address.create({
        userId,
        recipientName,
        phoneNumber,
        addressLine,
        ward,
        district,
        city,
        isDefault: isDefault || false,
      });
      res.status(201).json({ success: true, address: newAddress });
    } catch (error) {
      console.error("Lỗi thêm địa chỉ:", error);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  static async updateAddress(req, res) {
    try {
      const userId = req.user._id;
      const addressId = req.params.addressId;
      const {
        recipientName,
        phoneNumber,
        addressLine,
        ward,
        district,
        city,
        isDefault,
      } = req.body;
      // Nếu là mặc định → bỏ mặc định cũ
      if (isDefault) {
        await Address.updateMany({ userId }, { isDefault: false });
      }
      const updatedAddress = await Address.findOneAndUpdate(
        { _id: addressId, userId },
        {
          recipientName,
          phoneNumber,
          addressLine,
          ward,
          district,
          city,
          isDefault: isDefault || false,
        },
        { new: true }
      );
      if (!updatedAddress) {
        return res
          .status(404)
          .json({ success: false, message: "Địa chỉ không tồn tại" });
      }
      res.json({ success: true, address: updatedAddress });
    } catch (error) {
      console.error("Lỗi cập nhật địa chỉ:", error);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  static async deleteAddress(req, res) {
    try {
      const userId = req.user._id;
      const addressId = req.params.addressId;
      const deletedAddress = await Address.findOneAndDelete({
        _id: addressId,
        userId,
      });
      if (!deletedAddress) {
        return res
          .status(404)
          .json({ success: false, message: "Địa chỉ không tồn tại" });
      }
      res.json({ success: true, message: "Xóa địa chỉ thành công" });
    } catch (error) {
      console.error("Lỗi xóa địa chỉ:", error);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }
}

module.exports = AuthController;
