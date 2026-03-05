// controllers/TypeController.js
const Type = require("../models/Type");
const Product = require("../models/Product");

class TypeController {
  // Lấy tất cả types (dùng cho filter frontend + admin)
  static async getAllTypes(req, res) {
    try {
      const types = await Type.find({ isActive: true })
        .sort({ order: 1, "name.vi": 1 })
        .select("name slug icon image productCount order");
      res.json({ success: true, types });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Admin: Tạo mới
  static async createType(req, res) {
    try {
      const { name, description, icon, image, order } = req.body;
      const type = new Type({
        name: { vi: name.vi, en: name.en || name.vi, cz: name.cz || name.vi },
        description: description || {},
        icon,
        image,
        order: order || 0,
      });
      await type.save();
      res.status(201).json({ success: true, type });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Admin: Cập nhật
  static async updateType(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const type = await Type.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });
      if (!type)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy" });
      res.json({ success: true, type });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Admin: Xóa (kiểm tra productCount)
  static async deleteType(req, res) {
    try {
      const { id } = req.params;
      const type = await Type.findById(id);
      if (!type) return res.status(404).json({ success: false });

      if (type.productCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Còn ${type.productCount} sản phẩm đang dùng loại này. Không thể xóa.`,
        });
      }

      await Type.findByIdAndDelete(id);
      res.json({ success: true, message: "Xóa thành công" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // TẠO DỮ LIỆU MẪU
  static async seed(req, res) {
    try {
      await Type.deleteMany({});

      const data = require("../data/types");
      const typesData = data.types;

      const inserted = [];

      for (const item of typesData) {
        const type = new Type(item);
        await type.save(); // ← middleware pre("save") sẽ chạy
        inserted.push(type);
      }
    } catch (error) {
      console.error("Lỗi seedColors:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi seed dữ liệu màu",
        error: error.message,
      });
    }
  }
}

module.exports = TypeController;
