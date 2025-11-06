const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Order = require('../models/Order');
const Address = require('../models/Address');


class AuthController {
  // === ĐĂNG KÝ ===
  static async register(req, res) {
    try {
      const { email, password, firstName, lastName, phoneNumber, address } = req.body;

      // Kiểm tra email
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

      const newUser = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        address,
        refreshToken: hashedRefreshToken
      });

      const accessToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const refreshToken = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

      // LƯU REFRESH TOKEN ĐÃ MÃ HÓA VÀO CSDL
      res.status(201).json({ 
        success: true, 
        message: 'Đăng ký thành công', 
        userId: newUser._id,
        accessToken,
        refreshToken
       });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }

  // === ĐĂNG NHẬP ===
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
      }

      const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const refreshToken = jwt.sign({ email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

      await User.updateOne({ _id: user._id }, { refreshToken: hashedRefreshToken });

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
          phoneNumber: user.phoneNumber 
        } 
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }

  // === REFRESH TOKEN ===
  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'Không có refresh token' });
      }

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findOne({ email: decoded.email });
      if (!user || !(await bcrypt.compare(refreshToken, user.refreshToken))) {
        return res.status(401).json({ success: false, message: 'Refresh token không hợp lệ' });
      }

      const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const newRefreshToken = jwt.sign({ email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
      const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);

      await User.updateOne({ _id: user._id }, { refreshToken: hashedNewRefreshToken });

      res.json({
        success: true,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      });
    } catch (error) {
      console.error('Refresh token error:', error.message, error.stack);
      res.status(401).json({ success: false, message: 'Refresh token không hợp lệ hoặc đã hết hạn' });
    }
  }

  // === LẤY USER HIỆN TẠI ===
  static async getCurrentUser(req, res) {
    try {
      // req.user được gán bởi middleware `auth`
      const userId = req.user.id;
      const user = await User.findById(userId).select('-password -refreshToken');
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
      }

      res.json({
        success: true,
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          address: user.address
        }
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }

  // === ĐĂNG XUẤT ===
  static async logout(req, res) {
    try {
      const userId = req.user.id;
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Không có quyền truy cập' });
      }
      await User.updateOne({ _id: userId }, { refreshToken: null });
      res.json({ success: true, message: 'Đăng xuất thành công' });
    } catch (error) {
      console.error('Logout error:', error.message, error.stack);
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }

  // === LẤY TẤT CẢ USER (ADMIN) ===
  static async getUsers(req, res) {
    try {
      const users = await User.find({}, { password: 0, refreshToken: 0 });
      res.json({ success: true, users });
    } catch (error) {
      console.error('Get users error:', error.message, error.stack);
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }

  // === LẤY ĐƠN HÀNG ===
  static async getOrders(req, res) {
    try {
      const userId = req.user.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Không có quyền truy cập', expired: true });
      }
      const orders = await Order.find({ userId }).populate('items.productId');
      res.json({ success: true, orders });
    } catch (error) {
      console.error('Get orders error:', error.message, error.stack);
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }

  // === ĐỔI MẬT KHẨU ===
  static async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Mật khẩu cũ không đúng' });
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      // user.password = hashedNewPassword;
      await User.updateOne(
        { _id: userId },
        { $set: { password: hashedNewPassword } }
      );
      res.json({ success: true, message: 'Đổi mật khẩu thành công' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }

  // === LẤY ĐỊA CHỈ ===
  static async getAddressAll(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: 'Không có quyền truy cập' });
      }

      const userId = req.user.id;
      const addresses = await Address.find({ userId }).sort({ isDefault: -1 });
      res.json({ success: true, addresses });
    } catch (error) {
      console.error('Lỗi lấy địa chỉ:', error);
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }

  static async addAddress(req, res) {
    try {
      const userId = req.user.id;
      const { recipientName, phoneNumber, addressLine, ward, district, city, isDefault } = req.body;

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
        isDefault: isDefault || false
      });
      res.status(201).json({ success: true, address: newAddress });
    } catch (error) {
      console.error('Lỗi thêm địa chỉ:', error);
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }

  static async updateAddress(req, res) {
    try {
      const userId = req.user._id;
      const addressId = req.params.addressId;
      const { recipientName, phoneNumber, addressLine, ward, district, city, isDefault } = req.body;
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
          isDefault: isDefault || false
        },
        { new: true }
      );
      if (!updatedAddress) {
        return res.status(404).json({ success: false, message: 'Địa chỉ không tồn tại' });
      }
      res.json({ success: true, address: updatedAddress });
    } catch (error) {
      console.error('Lỗi cập nhật địa chỉ:', error);
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }

  static async deleteAddress(req, res) {
    try {
      const userId = req.user._id;
      const addressId = req.params.addressId;
      const deletedAddress = await Address.findOneAndDelete({ _id: addressId, userId });
      if (!deletedAddress) {
        return res.status(404).json({ success: false, message: 'Địa chỉ không tồn tại' });
      }
      res.json({ success: true, message: 'Xóa địa chỉ thành công' });
    } catch (error) {
      console.error('Lỗi xóa địa chỉ:', error);
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }
}

module.exports = AuthController;