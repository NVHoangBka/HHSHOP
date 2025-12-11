const New = require("../models/New");
const Tag = require("../models/Tag");

class NewController {
  static async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const skip = (page - 1) * limit;

      const [news, total] = await Promise.all([
        New.find({ isPublished: true })
          .select("title slug thumbnail description formattedDate tags")
          .populate("tags", "name slug")
          .sort({ publishedAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),

        New.countDocuments({ isPublished: true }),
      ]);

      res.json({
        success: true,
        data: news,
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
  // ==================== 2. TIN TỨC NỔI BẬT (trang chủ, sidebar) ====================
  static async getFeatured(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 5;

      const featured = await New.find({ isPublished: true })
        .select("title slug thumbnail description formattedDate")
        .populate("tags", "name slug")
        .sort({ views: -1, publishedAt: -1 })
        .limit(limit)
        .lean();

      res.json({ success: true, data: featured });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  // ==================== 3. CHI TIẾT BÀI VIẾT (SEO + tăng view) ====================
  static async getBySlug(req, res) {
    try {
      const { slug } = req.params;

      const article = await New.findOne({ slug, isPublished: true })
        .populate("tags", "name slug")
        .lean();

      if (!article) {
        return res.status(404).json({
          success: false,
          message: "Bài viết không tồn tại hoặc đã bị xóa",
        });
      }

      // Tăng lượt xem
      await New.findByIdAndUpdate(article._id, { $inc: { views: 1 } });

      // Bài liên quan (cùng tag, khác bài hiện tại)
      const related = await New.find({
        tags: { $in: article.tags.map((t) => t._id) },
        _id: { $ne: article._id },
        isPublished: true,
      })
        .select("title slug thumbnail description formattedDate")
        .limit(6)
        .sort({ publishedAt: -1 })
        .lean();

      res.json({
        success: true,
        data: { ...article, related },
        seo: {
          title: article.metaTitle || article.title,
          description: article.metaDescription || article.description,
          image: article.thumbnail,
          url: `${process.env.CLIENT_URL}/tin-tuc/${article.slug}`,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  // ==================== 4. TIN TỨC THEO TAG ====================
  static async getByTag(req, res) {
    try {
      const { slug } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = 12;
      const skip = (page - 1) * limit;

      const tag = await Tag.findOne({ slug });
      if (!tag) {
        return res
          .status(404)
          .json({ success: false, message: "Tag không tồn tại" });
      }

      const [news, total] = await Promise.all([
        New.find({ tags: tag._id, isPublished: true })
          .select("title slug thumbnail description formattedDate")
          .populate("tags", "name slug")
          .sort({ publishedAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),

        New.countDocuments({ tags: tag._id, isPublished: true }),
      ]);

      res.json({
        success: true,
        tag: tag.name,
        data: news,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        seo: {
          title: `${tag.name} - Tin tức mới nhất`,
          description: `Tổng hợp bài viết về ${tag.name.toLowerCase()} mới nhất, chất lượng cao`,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ==================== 5. TÌM KIẾM BÀI VIẾT ====================
  static async search(req, res) {
    try {
      const { q } = req.query;
      if (!q || q.trim().length < 2) {
        return res.json({ success: true, data: [], total: 0 });
      }

      const regex = new RegExp(q.trim(), "i");
      const [news, total] = await Promise.all([
        New.find({
          isPublished: true,
          $or: [{ title: regex }, { description: regex }, { content: regex }],
        })
          .select("title slug thumbnail description formattedDate")
          .sort({ publishedAt: -1 })
          .limit(20)
          .lean(),

        New.countDocuments({
          isPublished: true,
          $or: [{ title: regex }, { description: regex }, { content: regex }],
        }),
      ]);

      res.json({ success: true, data: news, total });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = NewController;
