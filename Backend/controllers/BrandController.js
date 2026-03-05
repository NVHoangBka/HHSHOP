// controllers/BrandController.js
const Brand = require("../models/Brand");
const Product = require("../models/Product");

class BrandController {
  // Lấy tất cả brands
  static async getAllBrands(req, res) {
    try {
      const brands = await Brand.find({ isActive: true }).sort({
        order: 1,
        "name.vi": 1,
      });
      res.json({ success: true, brands });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Admin: Tạo mới
  static async createBrand(req, res) {
    try {
      const { name, description, logo, isActive } = req.body;
      const brand = new Brand({
        name,
        description: description || {},
        logo,
        isActive,
      });
      await brand.save();
      res.status(201).json({ success: true, brand });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Admin: Cập nhật
  static async updateBrand(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const brand = await Brand.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });
      if (!brand)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy" });
      res.json({ success: true, brand });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Admin: Xóa (kiểm tra productCount)
  static async deleteBrand(req, res) {
    try {
      const { id } = req.params;
      const brand = await Brand.findById(id);
      if (brand) return res.status(404).json({ success: false });

      if (brand.productCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Còn ${brand.productCount} sản phẩm đang dùng loại này. Không thể xóa.`,
        });
      }

      await Brand.findByIdAndDelete(id);
      res.json({ success: true, message: "Xóa thành công" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // TẠO DỮ LIỆU MẪU
  static async seed(req, res) {
    try {
      await Brand.deleteMany({});

      const data = require("../data/brands");
      const brandsData = data.brands;

      const inserted = [];

      for (const item of brandsData) {
        const brand = new Brand(item);
        await brand.save();
        inserted.push(brand);
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

module.exports = BrandController;
