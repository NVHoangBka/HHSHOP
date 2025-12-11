const Tag = require("../models/Tag");
const Product = require("../models/Product");
const New = require("../models/New");

class TagController {
  static async getAllTags(req, res) {
    try {
      const { for: type } = req.query;
      let filter = { isActive: true };

      if (type === "product") filter.productCount = { $gt: 0 };
      if (type === "new") filter.newCount = { $gt: 0 };

      const tags = await Tag.find(filter)
        .sort({ totalCount: -1, name: 1 })
        .select("name slug newCount productCount type");

      res.json(tags);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  static async getTagDetail(req, res) {
    try {
      const { slug } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = 12;

      const tag = await Tag.findOne({ slug });
      if (!tag) return res.status(404).json({ message: "Tag không tồn tại" });

      const [products, news, totalProducts, totalNews] = await Promise.all([
        Product.find({ tags: tag._id, isActive: true })
          .select("name slug image price discountPrice finalPrice")
          .limit(limit)
          .skip((page - 1) * limit)
          .lean(),

        New.find({ tags: tag._id, isPublished: true })
          .select("title slug thumbnail description formattedDate")
          .limit(limit)
          .skip((page - 1) * limit)
          .sort({ publishedAt: -1 })
          .lean(),

        Product.countDocuments({ tags: tag._id, isActive: true }),
        New.countDocuments({ tags: tag._id, isPublished: true }),
      ]);

      res.json({
        tag: tag.name,
        products: { data: products, total: totalProducts, page, limit },
        news: { data: news, total: totalNews, page, limit },
        seo: {
          title: `${tag.name} - Sản phẩm & Tin tức mới nhất`,
          description: `Tổng hợp sản phẩm và bài viết về ${tag.name.toLowerCase()} chất lượng cao`,
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = TagController;
