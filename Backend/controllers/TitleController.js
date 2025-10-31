// backend/controllers/TitleController.js
const Title = require('../models/Title');

class TitleController {
  static async getAll(req, res) {
    try {
      const { type } = req.query;
      const query = {};

      if (type) query.type = type;
      const titles = await Title.find(query).sort({ createdAt: 1 });
      res.json({ success: true, titles });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }
}

module.exports = TitleController;