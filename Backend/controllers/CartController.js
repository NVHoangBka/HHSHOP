// backend/controllers/CartController.js
const Cart = require("../models/Cart");
const Product = require("../models/Product");

class CartController {
  // ====================== LẤY GIỎ HÀNG ======================
  static async getCart(req, res) {
    try {
      const userId = req.user.id;
      let cart = await Cart.findOne({ userId }).populate({
        path: "items.productId",
        select:
          "name slug image gallery variants price discountPrice finalPrice stock inStock",
      });

      if (!cart) {
        cart = await Cart.create({ userId, items: [] });
      }

      res.json({ success: true, cart: cart.toObject({ virtuals: true }) });
    } catch (error) {
      console.error("getCart error:", error);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  // THÊM SẢN PHẨM
  static async addItem(req, res) {
    try {
      const userId = req.user.id;
      const { productId, variantValue = "default", quantity = 1 } = req.body;

      // Validate đầu vào
      if (!productId || !variantValue) {
        return res.status(400).json({
          success: false,
          message: "Thiếu productId hoặc variantValue",
        });
      }

      if (quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Số lượng phải ≥ 1",
        });
      }

      const product = await Product.findById(productId);
      if (!product)
        return res
          .status(404)
          .json({ success: false, message: "Sản phẩm không tồn tại" });

      // Kiểm tra variant & tồn kho
      let availableStock = 0;

      if (product.variants && product.variants.length > 0) {
        const selectedVariant = product.variants.find(
          (v) => v.value === variantValue,
        );
        if (!selectedVariant) {
          return res
            .status(400)
            .json({ success: false, message: "Biến thể không tồn tại" });
        }
        availableStock = selectedVariant.stock;
      } else {
        // Sản phẩm không có variant
        if (variantValue !== "default") {
          return res.status(400).json({
            success: false,
            message: "Sản phẩm này không có biến thể",
          });
        }
        availableStock = product.totalStock || 0;
      }

      if (availableStock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Chỉ còn ${availableStock} sản phẩm trong kho`,
        });
      }

      // Tìm hoặc tạo giỏ hàng
      let cart = await Cart.findOne({ userId });
      if (!cart) cart = new Cart({ userId, items: [] });

      // Tìm item trùng (cùng product + cùng variant)
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === productId &&
          item.variantValue === variantValue,
      );

      if (itemIndex > -1) {
        // Đã có → cộng dồn, kiểm tra tổng không vượt tồn kho
        const newQty = cart.items[itemIndex].quantity + quantity;
        if (newQty > availableStock) {
          return res.status(400).json({
            success: false,
            message: `Tổng số lượng vượt tồn kho (còn ${availableStock})`,
          });
        }
        cart.items[itemIndex].quantity = newQty;
      } else {
        // Chưa có → thêm mới
        cart.items.push({ productId, variantValue, quantity });
      }

      await cart.save();

      await cart.populate({
        path: "items.productId",
        select:
          "name slug image gallery variants price discountPrice finalPrice stock inStock",
      });

      res.json({ success: true, cart: cart.toObject({ virtuals: true }) });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  // ====================== CẬP NHẬT SỐ LƯỢNG ======================
  static async updateItem(req, res) {
    try {
      const userId = req.user.id;
      const { productId, variantValue = "default", quantity } = req.body;

      if (!productId || !variantValue || !quantity || quantity < 1) {
        return res
          .status(400)
          .json({ success: false, message: "Dữ liệu không hợp lệ" });
      }

      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res
          .status(404)
          .json({ success: false, message: "Giỏ hàng không tồn tại" });
      }

      const itemIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === productId &&
          item.variantValue === variantValue,
      );

      if (itemIndex === -1) {
        return res
          .status(404)
          .json({ success: false, message: "Sản phẩm không trong giỏ" });
      }

      // Kiểm tra tồn kho
      const product = await Product.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Sản phẩm không tồn tại" });
      }

      let availableStock = 0;
      if (product.variants && product.variants.length > 0) {
        const variant = product.variants.find((v) => v.value === variantValue);
        availableStock = variant ? variant.stock : 0;
      } else {
        availableStock = product.totalStock || 0;
      }

      if (quantity > availableStock) {
        return res.status(400).json({
          success: false,
          message: `Chỉ còn ${availableStock} sản phẩm trong kho`,
        });
      }

      cart.items[itemIndex].quantity = quantity;
      await cart.save();

      await cart.populate({
        path: "items.productId",
        select:
          "name slug image gallery variants price discountPrice finalPrice stock inStock",
      });

      res.json({ success: true, cart: cart.toObject({ virtuals: true }) });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  // XÓA SẢN PHẨM
  static async removeItem(req, res) {
    try {
      const userId = req.user.id;
      const { productId, variantValue = "default" } = req.body;

      if (!productId || !variantValue) {
        return res.status(400).json({
          success: false,
          message: "Thiếu productId hoặc variantValue",
        });
      }

      const cart = await Cart.findOne({ userId });
      if (!cart)
        return res
          .status(404)
          .json({ success: false, message: "Giỏ hàng không tồn tại" });

      cart.items = cart.items.filter(
        (item) =>
          !(
            item.productId.toString() === productId &&
            item.variantValue === variantValue
          ),
      );

      await cart.save();

      await cart.populate({
        path: "items.productId",
        select:
          "name slug image gallery variants price discountPrice finalPrice stock inStock",
      });

      res.json({ success: true, cart: cart.toObject({ virtuals: true }) });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  // XÓA GIỎ HÀNG
  static async clearCart(req, res) {
    try {
      const userId = req.user.id;
      await Cart.deleteOne({ userId });
      res.json({ success: true, cart: { items: [] } });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }
}

module.exports = CartController;
