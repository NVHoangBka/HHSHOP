// backend/controllers/AdminController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product"); // <-- ĐÚNG TÊN MODEL

// Blacklist token (tạm dùng Set, sau này thay bằng Redis)
const tokenBlacklist = new Set();

class AdminController {
  // ====================== AUTH ======================
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const admin = await User.findOne({ email, role: "admin" }).select(
        "+password"
      );
      if (!admin || !(await admin.comparePassword(password))) {
        return res.status(401).json({
          success: false,
          message: "Email hoặc mật khẩu không đúng",
        });
      }

      const accessToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { id: admin._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      admin.refreshToken = refreshToken;
      await admin.save({ validateBeforeSave: false });

      res.json({
        success: true,
        message: "Đăng nhập thành công!",
        accessToken,
        refreshToken,
        user: {
          id: admin._id,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          phoneNumber: admin.phoneNumber,
          role: admin.role,
          fullName: admin.fullName,
        },
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  static async logout(req, res) {
    try {
      addToBlacklist(req.token);

      // Xóa refresh token trong DB
      if (req.user) {
        await User.updateOne(
          { _id: req.user.id },
          { $unset: { refreshToken: 1 } }
        );
      }

      res.json({ success: true, message: "Đăng xuất thành công!" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  static async refreshToken(req, res) {
    try {
      const { token } = req.body;
      if (!token)
        return res
          .status(401)
          .json({ success: false, message: "Không có refresh token" });

      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const admin = await User.findOne({
        _id: decoded.id,
        refreshToken: token,
      });
      if (!admin)
        return res
          .status(401)
          .json({ success: false, message: "Token không hợp lệ" });

      const newAccessToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ success: true, accessToken: newAccessToken });
    } catch (error) {
      res.status(401).json({ success: false, message: "Token hết hạn" });
    }
  }

  static async me(req, res) {
    try {
      const admin = await User.findById(req.user.id).select(
        "-password -refreshToken"
      );
      res.json({ success: true, user: admin });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  static async getAllDashBoardStats(req, res) {
    try {
    } catch (error) {}
  }

  // ====================== USER MANAGEMENT ======================
  static async getUsers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const users = await User.find({ role: { $ne: "admin" } })
        .select("-password -refreshToken")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await User.countDocuments({ role: { $ne: "admin" } });

      res.json({
        success: true,
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  // ====================== ORDER MANAGEMENT ======================
  static async getAllOrders(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const status = req.query.status;

      const filter = status ? { status } : {};
      const orders = await Order.find(filter)
        .populate("userId", "email fullName phoneNumber")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Order.countDocuments(filter);

      res.json({
        success: true,
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  static async updateOrderStatus(req, res) {
    try {
      const { status } = req.body;
      const validStatus = [
        "confirmed",
        "preparing",
        "shipped",
        "delivered",
        "canceled",
        "returned",
      ];
      if (!validStatus.includes(status)) {
        return res
          .status(400)
          .json({ success: false, message: "Trạng thái không hợp lệ" });
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status, [`${status}At`]: new Date() },
        { new: true }
      );

      if (!order)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy đơn hàng" });

      res.json({
        success: true,
        message: "Cập nhật trạng thái thành công",
        order,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  // ====================== PRODUCT MANAGEMENT ======================
  static async getProducts(req, res) {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.json({ success: true, products });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  static async getProductById(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy sản phẩm" });
      res.json({ success: true, product });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  static async createProduct(req, res) {
    try {
      const thumbnail =
        req.files?.thumbnail?.[0]?.secure_url ||
        req.files?.thumbnail?.[0]?.path;
      const gallery =
        req.files?.gallery?.map((f) => f.secure_url || f.path) || [];

      const product = await Product.create({
        ...req.body,
        thumbnail,
        gallery,
      });

      res
        .status(201)
        .json({ success: true, message: "Tạo sản phẩm thành công", product });
    } catch (error) {
      console.error("Create product error:", error);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  static async updateProduct(req, res) {
    try {
      const updates = { ...req.body };
      if (req.files?.thumbnail?.[0]) {
        updates.thumbnail =
          req.files.thumbnail[0].secure_url || req.files.thumbnail[0].path;
      }
      if (req.files?.gallery) {
        updates.gallery = req.files.gallery.map((f) => f.secure_url || f.path);
      }

      const product = await Product.findByIdAndUpdate(req.params.id, updates, {
        new: true,
      });
      if (!product)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy sản phẩm" });

      res.json({ success: true, message: "Cập nhật thành công", product });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy sản phẩm" });

      res.json({ success: true, message: "Xóa sản phẩm thành công" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }
}

module.exports = AdminController;
