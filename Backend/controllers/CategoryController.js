// backend/controllers/CartController.js
const Category = require("../models/Category");

class CategoryController {
  // LẤY DANH SÁCH DANH MỤC
  static async getCategories(req, res) {
    try {
      let categories = await Category.find({}).lean();

      if (!categories) {
        categories = await Category.create({ userId, items: [] });
      }

      res.json({ success: true, categories: categories });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  // LẤY DANH SÁCH DANH MỤC CON
  static async getSubCategories(req, res) {
    try {
      let subcategories = await Category.find({ parent: { $ne: null } }).lean();
      res.json({ success: true, subcategories: subcategories });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  // TẠO DỮ LIỆU MẪU
  static async seed(req, res) {
    try {
      await Category.deleteMany({});
      const categoriesData = require("../data/categories.js");
      await Category.insertMany(categoriesData.categories);
      res.json({ success: true, message: "Đã seed dữ liệu!" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = CategoryController;
