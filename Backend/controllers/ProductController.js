// backend/controllers/ProductController.js
const mongoose = require("mongoose");
const Product = require("../models/Product");
const SearchKeyword = require("../models/SearchKeyword");
const slugify = require("slugify");

class ProductController {
  // ====================== LẤY TẤT CẢ ======================
  static async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const { q, type, tag, brand, sort = "-createdAt" } = req.query;

      const filter = { isActive: true };
      if (q) filter.$text = { $search: q };
      if (type) filter.types = type;
      if (tag) filter.tags = tag;
      if (brand) filter.brand = brand;

      const [products, total] = await Promise.all([
        Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
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
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  // ====================== LẤY THEO TAG ======================
  static async getByTag(req, res) {
    try {
      const { tag } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        Product.find({ tags: tag, isActive: true })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Product.countDocuments({ tags: tag, isActive: true }),
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
      console.error("getByTag error:", error);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  // ====================== LẤY THEO TYPE ======================
  static async getByType(req, res) {
    try {
      const { type } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        Product.find({ types: type, isActive: true })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Product.countDocuments({ types: type, isActive: true }),
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
      console.error("getByType error:", error);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  // ====================== LẤY THEO CATEGORY ======================
  static async getByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "ID danh mục không hợp lệ",
        });
      }

      const filter = { categories: categoryId, isActive: true };

      const [products, total] = await Promise.all([
        Product.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
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
      console.error("Lỗi getByCategory:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi lấy sản phẩm theo danh mục",
        error: error.message,
      });
    }
  }

  // ====================== LẤY THEO SUBCATEGORY ======================
  static async getBySubCategory(req, res) {
    try {
      const { subCategoryId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
        return res.status(400).json({
          success: false,
          message: "ID danh mục con không hợp lệ",
        });
      }

      const filter = { subCategories: subCategoryId, isActive: true };

      const [products, total] = await Promise.all([
        Product.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
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
      console.error("Lỗi getBySubCategory:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi lấy sản phẩm theo danh mục con",
        error: error.message,
      });
    }
  }

  // ====================== LẤY THEO ID ======================
  static async getById(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res
          .status(400)
          .json({ success: false, message: "ID không hợp lệ" });
      }
      const product = await Product.findById(req.params.id).lean();
      if (!product)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy" });
      res.json({ success: true, product });
    } catch (error) {
      console.error("getById error:", error);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  // ====================== LẤY THEO SLUG ======================
  static async getBySlug(req, res) {
    try {
      const { slug } = req.params;
      const product = await Product.findOne({
        $or: [{ "slug.vi": slug }, { "slug.en": slug }, { "slug.cz": slug }],
        isActive: true,
      }).lean();

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy" });
      }

      // Tăng view count bất đồng bộ, không chặn response
      Product.updateOne({ _id: product._id }, { $inc: { viewCount: 1 } }).catch(
        (err) => console.error("viewCount update error:", err),
      );

      res.json({ success: true, products: product });
    } catch (error) {
      console.error("getBySlug error:", error);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  static async seed(req, res) {
    try {
      await Product.deleteMany({});
      const { products } = require("../data/products.js");
      const seededProducts = [];
      for (const prodData of products) {
        // Tự động sinh slug đa ngôn ngữ nếu chưa có
        const languages = ["vi", "en", "cz"];
        prodData.slug = prodData.slug || {};

        for (const lang of languages) {
          const nameLang = prodData.name[lang] || prodData.name.vi;
          if (nameLang && !prodData.slug[lang]) {
            prodData.slug[lang] = slugify(nameLang, {
              lower: true,
              strict: true,
              locale: lang === "vi" ? "vi" : "en",
            });
          }
        }

        const product = await Product.create(prodData);
        seededProducts.push(product);
      }
      res.json({ success: true, message: "Đã seed dữ liệu!" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async search(req, res) {
    try {
      const { q = "", category = "all", lang = "vi" } = req.query;

      const filter = {};

      if (q.trim() !== "") {
        filter[`name.${lang}`] = {
          $regex: q,
          $options: "i",
        };
      }

      if (category !== "all") {
        filter.types = category;
      }

      const products = await Product.find(filter)
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

      res.json({
        success: true,
        products,
      });
    } catch (error) {
      console.error("SearchLive error:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống",
      });
    }
  }

  static async saveKeyword(req, res) {
    try {
      const { keyword, lang } = req.body;

      if (!keyword?.trim()) {
        return res.json({ success: true });
      }

      const existing = await SearchKeyword.findOne({
        keyword,
        lang,
      });

      if (existing) {
        existing.count += 1;
        await existing.save();
      } else {
        await SearchKeyword.create({
          keyword,
          lang,
          count: 1,
        });
      }

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false });
    }
  }

  static async getPopularKeywords(req, res) {
    try {
      const { lang } = req.query;

      const keywords = await SearchKeyword.find({ lang })
        .sort({ count: -1 })
        .limit(10)
        .lean();

      res.json({
        success: true,
        keywords,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
      });
    }
  }
}

module.exports = ProductController;
