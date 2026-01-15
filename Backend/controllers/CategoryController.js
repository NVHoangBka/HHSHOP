// backend/controllers/CategoryController.js
const mongoose = require("mongoose");
const Category = require("../models/Category");

class CategoryController {
  /**
   * LẤY DANH MỤC CẤP 1 + CON (CÂY DANH MỤC)
   * GET /api/categories
   */
  static async getCategories(req, res) {
    try {
      const categories = await Category.find({ parent: null, isActive: true })
        .populate({
          path: "children",
          match: { isActive: true },
          select:
            "name slug value description image order isFeatured homeOrder",
          options: { sort: { order: 1 } },
        })
        .select(
          "name slug value description image color order isFeatured homeOrder"
        )
        .sort({ order: 1, homeOrder: 1 })
        .lean();

      res.json({
        success: true,
        categories: categories || [],
      });
    } catch (error) {
      console.error("Lỗi getCategories:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi lấy danh mục",
        error: error.message,
      });
    }
  }

  /**
   * LẤY TẤT CẢ DANH MỤC CON (không theo cha cụ thể)
   * GET /api/categories/subcategories
   */
  static async getAllSubCategories(req, res) {
    try {
      const subCategories = await Category.find({
        parent: { $ne: null },
        isActive: true,
      })
        .populate("parent", "name slug value")
        .select("name slug value description parent order")
        .sort({ order: 1 })
        .lean();

      res.json({
        success: true,
        subCategories: subCategories || [],
      });
    } catch (error) {
      console.error("Lỗi getAllSubCategories:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi lấy tất cả danh mục con",
        error: error.message,
      });
    }
  }

  /**
   * LẤY DANH MỤC CON THEO DANH MỤC CHA
   */
  static async getSubCategories(req, res) {
    try {
      const { categoryId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "ID danh mục cha không hợp lệ",
        });
      }

      const subCategories = await Category.find({
        parent: categoryId,
        isActive: true,
      })
        .select("name slug value description order")
        .sort({ order: 1 })
        .lean();

      res.json({
        success: true,
        subCategories: subCategories || [],
      });
    } catch (error) {
      console.error("Lỗi getSubCategories:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi lấy danh mục con",
        error: error.message,
      });
    }
  }

  /**
   * TẠO DANH MỤC MỚI
   * POST /api/categories
   * Body: { name: {vi, en, cz}, slug: {...}, value: {...}, parent?, ... }
   */
  static async createCategory(req, res) {
    try {
      const categoryData = req.body;
      const newCategory = await Category.create(categoryData);

      res.status(201).json({
        success: true,
        message: "Tạo danh mục thành công",
        category: newCategory,
      });
    } catch (error) {
      console.error("Lỗi createCategory:", error);
      res.status(400).json({
        success: false,
        message: "Lỗi khi tạo danh mục",
        error: error.message,
      });
    }
  }

  /**
   * CẬP NHẬT DANH MỤC
   * PUT /api/categories/:id
   */
  static async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "ID danh mục không hợp lệ",
        });
      }

      const updated = await Category.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      }).lean();

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy danh mục để cập nhật",
        });
      }

      res.json({
        success: true,
        message: "Cập nhật danh mục thành công",
        category: updated,
      });
    } catch (error) {
      console.error("Lỗi updateCategory:", error);
      res.status(400).json({
        success: false,
        message: "Lỗi khi cập nhật danh mục",
        error: error.message,
      });
    }
  }

  /**
   * XÓA DANH MỤC (soft delete)
   * DELETE /api/categories/:id
   */
  static async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "ID danh mục không hợp lệ",
        });
      }

      const category = await Category.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      ).lean();

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy danh mục để xóa",
        });
      }

      res.json({
        success: true,
        message: "Xóa danh mục thành công (soft delete)",
        category,
      });
    } catch (error) {
      console.error("Lỗi deleteCategory:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi xóa danh mục",
        error: error.message,
      });
    }
  }

  /**
   * TÌM DANH MỤC THEO VALUE
   * GET /api/categories/:value
   */
  static async getByValue(req, res) {
    try {
      const { value } = req.params;
      const category = await Category.findOne({
        $or: [
          {
            "value.vi": value,
          },
          {
            "value.en": value,
          },
          {
            "value.cz": value,
          },
        ],
        isActive: true,
      }).lean();

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy danh mục với value này",
        });
      }

      res.json({ success: true, category });
    } catch (error) {
      console.error("Lỗi getByValue:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống",
        error: error.message,
      });
    }
  }

  /**
   * SEED DỮ LIỆU DANH MỤC MẪU
   * POST /api/categories/seed
   */
  static async seed(req, res) {
    try {
      const data = require("../data/categories"); // file dữ liệu của bạn
      const categoriesData = data.categories;

      if (!Array.isArray(categoriesData)) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu categories không phải mảng",
        });
      }

      let imported = 0;
      const createdRoots = {};

      for (const catData of categoriesData) {
        const { children, ...rootData } = catData;

        let rootCat = await Category.findOne({ "slug.vi": rootData.slug?.vi });
        if (!rootCat) {
          rootCat = await Category.create(rootData);
          imported++;
          console.log(`Đã tạo cấp 1: ${rootCat.name.vi} (${rootCat._id})`);
        }
        createdRoots[rootCat._id.toString()] = rootCat;

        if (children && Array.isArray(children)) {
          for (const childData of children) {
            const exists = await Category.findOne({
              "slug.vi": childData.slug?.vi,
            });
            if (!exists) {
              await Category.create({
                ...childData,
                parent: rootCat._id,
                level: 1,
              });
              imported++;
              console.log(`  → Đã tạo con: ${childData.name.vi}`);
            }
          }
        }
      }

      res.json({
        success: true,
        message: `Đã import ${imported} danh mục`,
      });
    } catch (error) {
      console.error("Lỗi seed:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi seed dữ liệu danh mục",
        error: error.message,
      });
    }
  }
}

module.exports = CategoryController;
