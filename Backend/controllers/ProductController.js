// backend/controllers/ProductController.js
const Product = require("../models/Product");

class ProductController {
  // LẤY TẤT CẢ (có phân trang, lọc, tìm kiếm)
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

  static async getByTitle(req, res) {
    const { title } = req.params;
    try {
      const products = await Product.find({ titles: title });
      res.json({ success: true, products });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  static async getBySubTitle(req, res) {
    const { subtitle } = req.params;
    try {
      const products = await Product.find({ subTitles: subtitle });
      res.json({ success: true, products });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  static async getByTag(req, res) {
    const { tag } = req.params;
    const products = await Product.find({ tags: tag, isActive: true }).limit(
      20
    );
    res.json({ success: true, products });
  }

  static async getByType(req, res) {
    const { type } = req.params;
    const products = await Product.find({ types: type, isActive: true }).limit(
      20
    );
    res.json({ success: true, products });
  }

  static async getById(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ success: false });
      res.json({ success: true, product });
    } catch (error) {
      res.status(500).json({ success: false });
    }
  }

  static async seed(req, res) {
    try {
      await Product.deleteMany({});
      const { products } = require("../data/products.js");
      await Product.insertMany(products);
      res.json({ success: true, message: "Đã seed dữ liệu!" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async search(req, res) {
    try {
      const { q, category = "all" } = req.query;
      const products = await Product.find(
        { $text: { $search: q } },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" }, createdAt: -1 })
        .limit(20)
        .lean();

      res.json({ success: true, products });
      // const filter = {};
      // if (q) {
      //   const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      //   filter.name = { $regex: escaped, $options: "i" };
      // }
      // if (category !== "all") {
      //   filter.types = category;
      // }

      // const products = await Product.find(filter);
      // res.json({ success: true, products });
    } catch (error) {
      console.error("SearchLive error:", error);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  // Lấy theo slug (rất quan trọng cho trang chi tiết)
  static async getBySlug(req, res) {
    try {
      const { slug } = req.params;
      const product = await Product.findOne({ slug }).lean();
      if (!product)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy" });

      // Tăng view count
      await Product.updateOne({ _id: product._id }, { $inc: { viewCount: 1 } });

      res.json({ success: true, product });
    } catch (error) {
      res.status(500).json({ success: false });
    }
  }
}

module.exports = ProductController;
