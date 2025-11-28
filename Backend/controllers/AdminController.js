// backend/controllers/AdminAuthController.js  (MỚI)
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

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
      const users = await User.find({ role: { $ne: "admin" } })
        .select("-password -refreshToken")
        .lean();

      // Lấy danh sách đơn hàng để tính tổng
      const orders = await Order.find({}).select("userId totalAmount");

      // Tạo map để đếm số đơn + tổng tiền
      const orderStats = orders.reduce((acc, order) => {
        const userId = order.userId.toString();
        if (!acc[userId]) {
          acc[userId] = { count: 0, totalSpent: 0 };
        }
        acc[userId].count += 1;
        acc[userId].totalOrder += order.totalAmount;
        return acc;
      }, {});

      // 4. Gắn thống kê vào từng user
      const usersWithStats = users.map((user) => ({
        ...(user._doc || user),
        orderCount: orderStats[user._id]?.count || 0,
        totalOrder: orderStats[user._id]?.totalOrder || 0,
      }));

      res.json({ success: true, users: usersWithStats });
    } catch (error) {
      console.error("Get users error:", error.message, error.stack);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }
  // === LẤY TẤT CẢ Đơn hàng Order (ADMIN) ===
  static async getOrdersAllAdmin(req, res) {
    try {
      const orders = await Order.find({})
        .populate("items.productId", "name image price discountPrice")
        .sort({ createdAt: -1 });

      res.json({ success: true, orders });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // LẤY TẤT CẢ SẢN PHẨM CHO ADMIN (có phân trang + tìm kiếm)
  static async getProductsAllAdmin(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 15;
      const search = req.query.search?.trim();

      const filter = search ? { name: { $regex: search, $options: "i" } } : {};

      const [products, total] = await Promise.all([
        Product.find(filter)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        Product.countDocuments(filter),
      ]);

      res.json({
        success: true,
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  }

  // TẠO SẢN PHẨM MỚI
  static async createProductAdmin(req, res) {
    try {
      const product = new Product(req.body);
      await product.save();
      res.json({ success: true, message: "Thêm sản phẩm thành công", product });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // CẬP NHẬT SẢN PHẨM
  static async updateProductAdmin(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!product)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy" });
      res.json({ success: true, message: "Cập nhật thành công", product });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // XÓA SẢN PHẨM
  static async deleteProductAdmin(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndDelete(id);
      if (!product) return res.status(404).json({ success: false });
      res.json({ success: true, message: "Xóa thành công" });
    } catch (error) {
      res.status(500).json({ success: false });
    }
  }
}

module.exports = AdminAuthController;
