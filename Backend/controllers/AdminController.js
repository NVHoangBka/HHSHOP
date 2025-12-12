// backend/controllers/AdminController.js  (MỚI)
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

const New = require("../models/New");
const Tag = require("../models/Tag");
const { updateTagCounts } = require("../utils/updateTagCounts");

class AdminController {
  // ==================== AUTH ADMIN ====================
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
          acc[userId] = { count: 0, totalOrder: 0 };
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

  //============================== END AUTH ADMIN ================================

  // ============================== ORDERS ADMIN ================================
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

  // CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
  static async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await Order.findOneAndUpdate({ _id: id }, { status }, {});
      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy đơn hàng" });
      }

      res.json({
        success: true,
        message: "Cập nhật trạng thái thành công",
        order,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  // CẬP NHẬT TRẠNG THÁI THANH TOÁN
  static async updateOrderPaymentStatus(req, res) {
    try {
      const { id } = req.params;
      const { paymentStatus } = req.body;

      const order = await Order.findOneAndUpdate(
        { _id: id },
        { paymentStatus }
      );
      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy đơn hàng" });
      }
      res.json({
        success: true,
        message: "Cập nhật trạng thái thành công",
        order,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  //============================== END ORDERS ADMIN ================================

  // ============================== PRODUCTS ADMIN ================================

  // LẤY TẤT CẢ SẢN PHẨM CHO ADMIN (có phân trang + tìm kiếm)
  static async getProductsAllAdmin(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search?.trim();

      const filter = search ? { name: { $regex: search, $options: "i" } } : {};

      const [products, totalProducts] = await Promise.all([
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
          totalProducts,
          totalPages: Math.ceil(totalProducts / limit),
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
  //============================== END PRODUCTS ADMIN ================================

  // ==================== QUẢN LÝ TIN TỨC (NEWS) ADMIN ====================
  // Danh sách tin tức (admin)
  static async getNewsAdmin(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search?.trim();

      let query = {};
      if (search) {
        query.$or = [
          { title: new RegExp(search, "i") },
          { description: new RegExp(search, "i") },
        ];
      }

      const [news, total] = await Promise.all([
        New.find(query)
          .populate("tags", "name slug")
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        New.countDocuments(query),
      ]);

      res.json({
        success: true,
        news,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  //===== TẠO TIN TỨC =====
  static async createNew(req, res) {
    try {
      const {
        title,
        description,
        content,
        thumbnail,
        thumbnailAlt,
        tags,
        isPublished = false,
        publishedAt,
        metaTitle,
        metaDescription,
      } = req.body;

      const article = await New.create({
        title: title.trim(),
        description: description.trim(),
        content,
        thumbnail,
        thumbnailAlt: thumbnailAlt || title,
        tags,
        isPublished,
        publishedAt: isPublished ? publishedAt || new Date() : null,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || description,
      });

      await updateTagCounts();

      res.status(201).json({
        success: true,
        message: "Tạo bài viết thành công",
        data: article.populate("tags", "name slug"),
      });
    } catch (error) {
      // Nếu bị trùng slug → Mongoose sẽ tự throw lỗi duplicate key
      if (error.code === 11000 && error.keyPattern?.slug) {
        return res.status(400).json({
          success: false,
          message:
            "Tiêu đề tạo slug đã tồn tại. Vui lòng sửa tiêu đề một chút.",
        });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }

  //===== CẬP NHẬT TIN TỨC =====
  static async updateNew(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const article = await New.findById(id);

      if (!article) {
        return res
          .status(404)
          .json({ success: false, message: "Bài viết không tồn tại" });
      }

      Object.keys(updates).forEach((key) => {
        if (updates[key] !== undefined) {
          article[key] = updates[key];
        }
      });

      await article.save();
      await updateTagCounts();

      await article.populate("tags", "name slug");

      res.json({
        success: true,
        message: "Cập nhật bài viết thành công",
        data: article,
      });
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.slug) {
        return res.status(400).json({
          success: false,
          message: "Tiêu đề mới tạo slug trùng. Vui lòng sửa lại tiêu đề.",
        });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }

  //===== XOÁ TIN TỨC =====
  static async deleteNew(req, res) {
    try {
      const { id } = req.params;
      const article = await New.findByIdAndDelete(id);
      if (!article)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy" });

      await updateTagCounts();
      res.json({ success: true, message: "Xóa bài viết thành công" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  //============================== END NEWS ADMIN ================================

  // ==================== QUẢN LÝ TAGS ADMIN ====================
  static async getTagsAdmin(req, res) {
    try {
      const tags = await Tag.find().sort({ name: 1 });
      res.json({ success: true, data: tags });
    } catch (error) {
      res.status(500).json({ success: false });
    }
  }

  static async createTag(req, res) {
    try {
      const { name, type = "both", description, isActive = true } = req.body;

      if (!name?.trim()) {
        return res
          .status(400)
          .json({ success: false, message: "Tên tag không được để trống" });
      }

      const tag = await Tag.create({
        name: name.trim(),
        type,
        description,
        isActive,
      });

      res.status(201).json({ success: true, data: tag });
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({
          success: false,
          message:
            field === "slug"
              ? "Tên tag tạo slug đã tồn tại"
              : "Tên tag đã tồn tại",
        });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ======== CẬP NHẬT TAG ============
  static async updateTag(req, res) {
    try {
      const { id } = req.params;
      const { name, type, description, isActive } = req.body;
      const tag = await Tag.findById(id);
      if (!tag)
        return res
          .status(404)
          .json({ success: false, message: "Tag không tồn tại" });

      if (name !== undefined) tag.name = name.trim();
      if (type) tag.type = type;
      if (description !== undefined) tag.description = description;
      if (isActive !== undefined) tag.isActive = isActive;

      await tag.save();

      res.json({ success: true, data: tag });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Tên tag mới tạo slug đã tồn tại",
        });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }

  //===== XOÁ TAG =====
  static async deleteTag(req, res) {
    try {
      const { id } = req.params;
      const tag = await Tag.findByIdAndDelete(id);
      if (!tag)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy" });

      await updateTagCounts();
      res.json({ success: true, message: "Xóa tag thành công" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = AdminController;
