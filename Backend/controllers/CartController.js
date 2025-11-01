// backend/controllers/CartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Products');

class CartController {
  // LẤY GIỎ HÀNG CỦA USER
  static async getCart(req, res) {
    try {
      const userId = req.user.id;
      let cart = await Cart.findOne({ userId }).populate('items.productId');
      
      if (!cart) {
        cart = await Cart.create({ userId, items: [] });
      }

      res.json({ success: true, cart: cart.toObject() });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }

  // THÊM SẢN PHẨM
  static async addItem(req, res) {
    try {
      const userId = req.user.id;
      const { productId, quantity = 1 } = req.body;

      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });

      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }

      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      cart.updatedAt = Date.now();
      await cart.save();

      await cart.populate('items.productId');
      res.json({ success: true, cart: cart.toObject() });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }

  // CẬP NHẬT SỐ LƯỢNG
  static async updateItem(req, res) {
    try {
      const userId = req.user.id;
      const { productId, quantity } = req.body;

      if (quantity < 1) {
        return res.status(400).json({ success: false, message: 'Số lượng phải ≥ 1' });
      }

      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ success: false, message: 'Giỏ hàng không tồn tại' });

      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex === -1) {
        return res.status(404).json({ success: false, message: 'Sản phẩm không trong giỏ' });
      }

      cart.items[itemIndex].quantity = quantity;
      cart.updatedAt = Date.now();
      await cart.save();

      await cart.populate('items.productId');
      res.json({ success: true, cart: cart.toObject() });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }

  // XÓA SẢN PHẨM
  static async removeItem(req, res) {
    try {
      const userId = req.user.id;
      const { productId } = req.params;

      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ success: false, message: 'Giỏ hàng không tồn tại' });

      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
      cart.updatedAt = Date.now();
      await cart.save();

      await cart.populate('items.productId');
      res.json({ success: true, cart: cart.toObject() });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }

  // XÓA GIỎ HÀNG
  static async clearCart(req, res) {
    try {
      const userId = req.user.id;
      await Cart.deleteOne({ userId });
      res.json({ success: true, cart: { items: [] } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  }
}

module.exports = CartController;