const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Order = require('../models/Order');
const Address = require('../models/Address');


class AuthController {
  static async register(req, res) {
    try {
      const { email, password, firstName, lastName, phoneNumber, address } = req.body;
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
      }

      if (phoneNumber) {
        const existingPhone = await User.findOne({ phoneNumber });
        if (existingPhone) {
          return res.status(400).json({ success: false, message: 'Số điện thoại đã tồn tại' });
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const refreshToken = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
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

  static async getUsers(req, res) {
    try {
      const users = await User.find({}, { password: 0, refreshToken: 0 });
      res.json({ success: true, users });
    } catch (error) {
      console.error('Get users error:', error.message, error.stack);
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }

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

  static async getAddresses(req, res) {
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
}

module.exports = AuthController;