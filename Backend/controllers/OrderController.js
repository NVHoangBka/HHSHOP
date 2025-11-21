const Order = require("../models/Order");
const Product = require("../models/Products");
const mongoose = require("mongoose");

class OrderController {
  static async generateOrderId() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const prefix = `DH${year}${month}${day}`;

    // Tìm đơn hàng cuối cùng trong ngày để tăng số thứ tự
    return await Order.findOne({ orderId: new RegExp(`^${prefix}`) })
      .sort({ orderId: -1 })
      .then((lastOrder) => {
        let seq = 1;
        if (lastOrder) {
          const lastSeq = parseInt(lastOrder.orderId.slice(-3));
          seq = lastSeq + 1;
        }
        return `${prefix}${String(seq).padStart(3, "0")}`;
      });
  }

  // API: Tạo đơn hàng mới
  static async createOrder(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { address } = req.body;
      const userId = req.user.id; // Giả sử bạn đã có middleware auth

      // 1. Lấy giỏ hàng từ request (có thể từ body hoặc từ DB)
      const cartItems = req.body.items || []; // [{ productId, quantity }]

      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "Giỏ hàng trống!" });
      }

      if (!address) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập địa chỉ giao hàng!" });
      }

      // 2. Kiểm tra và lấy thông tin sản phẩm + tính tổng tiền
      let total = 0;
      const orderItems = [];

      for (let item of cartItems) {
        const product = await Product.findById(item.productId).session(session);

        if (!product) {
          throw new Error(`Sản phẩm không tồn tại: ${item.productId}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Sản phẩm "${product.name}" chỉ còn ${product.stock} cái!`
          );
        }

        // Giảm số lượng tồn kho
        product.stock -= item.quantity;
        await product.save({ session });

        // Tính giá (ưu tiên discountPrice)
        const price = product.discountPrice || product.price;

        total += price * item.quantity;

        orderItems.push({
          productId: product._id,
          quantity: item.quantity,
          price: price,
        });
      }

      // 3. Tạo mã đơn hàng
      const orderId = await OrderController.generateOrderId();

      // 4. Tạo đơn hàng mới
      const newOrder = new Order({
        userId,
        orderId,
        address,
        total,
        items: orderItems,
        status: "pending",
      });

      await newOrder.save({ session });

      await session.commitTransaction();
      session.endSession();

      // Trả về kết quả
      res.status(201).json({
        success: true,
        message: "Đặt hàng thành công!",
        order: {
          orderId: newOrder.orderId,
          total: newOrder.total,
          status: newOrder.status,
          createdAt: newOrder.createdAt,
        },
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      res.status(400).json({
        success: false,
        message: error.message || "Đặt hàng thất bại!",
      });
    }
  }

  // API: Lấy danh sách đơn hàng của user
  static async getOrders(req, res) {
    try {
      const orders = await Order.find({ userId: req.user.id })
        .populate("items.productId", "name image price discountPrice")
        .sort({ createdAt: -1 });

      res.json({ success: true, orders });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // API: Lấy chi tiết 1 đơn hàng
  static async getOrderDetail(req, res) {
    try {
      const order = await Order.findOne({
        orderId: req.params.orderId,
        userId: req.user.id,
      }).populate("items.productId", "name image");

      if (!order) {
        return res.status(404).json({ message: "Đơn hàng không tồn tại!" });
      }

      res.json({ success: true, order });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
module.exports = OrderController;
