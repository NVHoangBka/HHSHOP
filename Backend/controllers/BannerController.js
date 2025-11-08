// backend/controllers/BannerController.js
const Banner = require("../models/Banner");

class BannerController {
  static async getAll(req, res) {
    try {
      const banners = await Banner.find().sort({ createdAt: 1 });
      res.json({ success: true, banners });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }
}

module.exports = BannerController;
