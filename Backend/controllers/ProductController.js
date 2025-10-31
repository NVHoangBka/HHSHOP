// backend/controllers/ProductController.js
const Product = require('../models/Products');

class ProductController {
  static async getAll(req, res) {
    try {
      const products = await Product.find();
      res.json({ success: true, products });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }

  static async getByTitle(req, res) {
    const { title } = req.params;
    try {
      const products = await Product.find({ titles: title });
      res.json({ success: true, products });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }

  static async getBySubTitle(req, res) {
    const { subtitle } = req.params;
    try {
      const products = await Product.find({ subTitles: subtitle });
      res.json({ success: true, products });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }

  static async getByTag(req, res) {
    const { tag } = req.params;
    try {
      const products = await Product.find({ tag });
      res.json({ success: true, products });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }

  static async getByType(req, res) {
    const { type } = req.params;
    try {
      const products = await Product.find({ types: type });
      res.json({ success: true, products });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }

  static async getById(req, res) {
    const { id } = req.params;
    try {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
      res.json({ success: true, product });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }

  static async seed(req, res) {
    try {
      await Product.deleteMany({});
      const { products } = require('../data/products.js');
      await Product.insertMany(products);
      res.json({ success: true, message: 'Đã seed dữ liệu!' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = ProductController;