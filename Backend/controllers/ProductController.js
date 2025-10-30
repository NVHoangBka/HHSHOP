// backend/controllers/ProductController.js
const Product = require('../models/Product');

class ProductController {
  static async getAllProducts(req, res) {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.json({ success: true, products });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }
}

module.exports = ProductController;