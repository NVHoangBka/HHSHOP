// backend/controllers/CartController.js
const Category = require("../models/Category");

class CategoryController {
  /**
   * LẤY TOÀN BỘ DANH MỤC (cấp 1 + populate children)
   * GET /categories
   */
  static async getCategories(req, res) {
    try {
      const categories = await Category.find({ parent: null, isActive: true })
        .populate({
          path: "children",
          match: { isActive: true },
          select:
            "name slug value regular description image order isFeatured homeOrder",
          options: { sort: { order: 1 } },
        })
        .select("name slug description image color order isFeatured homeOrder")
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
   * LẤY DANH MỤC CON THEO DANH MỤC CHA
   * GET /subcategories?categoryId=xxx  (hoặc /subcategories/:categoryId)
   *
   * Gợi ý: Nên dùng query param hoặc param :categoryId
   */
  static async getSubCategories(req, res) {
    try {
      const { categoryId } = req.query; // hoặc req.params.categoryId nếu dùng /:categoryId

      if (!categoryId) {
        return res.status(400).json({
          success: false,
          message: "Thiếu categoryId (danh mục cha)",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "ID danh mục cha không hợp lệ",
        });
      }

      const subcategories = await Category.find({
        parent: categoryId,
        isActive: true,
      })
        .select("name slug value regular description")
        .sort({ order: 1 })
        .lean();

      res.json({
        success: true,
        subcategories: subcategories || [],
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

  // TẠO DỮ LIỆU MẪU
  static async seed(req, res) {
    try {
      await Category.deleteMany({});
      const data = require("../data/categories.js");
      const categoriesData = data.categories;

      const createdRoots = {};
      for (const catData of categoriesData) {
        const { children, ...rootData } = catData;

        let rootCat = await Category.findOne({ "slug.vi": rootData.slug?.vi });
        if (!rootCat) {
          rootCat = await Category.create(rootData);
          console.log(
            `Đã tạo danh mục cấp 1: ${rootCat.name.vi} (${rootCat._id})`
          );
        } else {
          console.log(
            `Danh mục cấp 1 đã tồn tại: ${rootCat.name.vi} (${rootCat._id})`
          );
        }
        createdRoots[rootCat._id.toString()] = rootCat;

        // Import children
        if (children && children.length > 0) {
          for (const childData of children) {
            const childExists = await Category.findOne({
              "slug.vi": childData.slug?.vi,
            });
            if (!childExists) {
              const child = await Category.create({
                ...childData,
                parent: rootCat._id,
                level: 1,
              });
              console.log(
                `  → Đã tạo danh mục con: ${child.name.vi} (${child._id})`
              );
            } else {
              console.log(
                `  → Danh mục con đã tồn tại: ${childExists.name.vi}`
              );
            }
          }
        }
      }
      res.json({ success: true, message: "Đã seed dữ liệu!" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = CategoryController;
