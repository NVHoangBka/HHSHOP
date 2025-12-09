const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");

class OrderController {
  static async generateOrderId() {
    const date = new Date();
    const prefix = `DH${date.getFullYear()}${String(
      date.getMonth() + 1
    ).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
    const lastOrder = await Order.findOne({
      orderId: new RegExp(`^${prefix}`),
    }).sort({ orderId: -1 });
    const seq = lastOrder ? parseInt(lastOrder.orderId.slice(-3)) + 1 : 1;
    return `${prefix}${String(seq).padStart(3, "0")}`;
  }

  // API: Tạo đơn hàng mới
  static async createOrder(req, res) {
    const session = await mongoose.startSession();

    try {
      await session.startTransaction();

      const {
        items: cartItems,
        shippingAddress,
        note,
        paymentMethod = paymentMethod || "COD",
        voucherCode,
        voucherDiscount = voucherDiscount || 0,
        shippingFee = shippingFee || 30000,
      } = req.body;

      const userId = req.user.id;

      // === VALIDATE ===
      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "Giỏ hàng trống!" });
      }
      if (!shippingAddress) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập địa chỉ giao hàng!" });
      }

      // === XỬ LÝ SẢN PHẨM + GIẢM KHO ===
      let subTotal = 0;
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

        subTotal += price * item.quantity;

        orderItems.push({
          productId: product._id,
          name: product.name,
          image: product.image,
          price,
          discountPrice: product.discountPrice || undefined,
          quantity: item.quantity,
          variant: item.variant,
        });
      }

      // === TÍNH TỔNG CUỐI ===
      const totalAmount = subTotal + shippingFee - voucherDiscount;

      // === TẠO MÃ ĐƠN HÀNG ===
      const orderId = await OrderController.generateOrderId();

      // 4. Tạo đơn hàng mới
      const newOrder = await Order.create(
        [
          {
            userId,
            orderId,
            shippingAddress,
            items: orderItems,
            subTotal,
            shippingFee,
            voucherCode: voucherCode || undefined,
            voucherDiscount,
            totalAmount,
            note: note || undefined,
            paymentMethod,
            paymentStatus: "pending",
            status: "pending",
          },
        ],
        { session }
      );

      // === COMMIT THÀNH CÔNG ===
      await session.commitTransaction();

      // === TRẢ VỀ KẾT QUẢ ===
      res.status(201).json({
        success: true,
        message: "Đặt hàng thành công!",
        order: {
          _id: newOrder[0]._id,
          orderId: newOrder[0].orderId,
          totalAmount: newOrder[0].totalAmount,
          paymentMethod: newOrder[0].paymentMethod,
          shippingAddress: newOrder[0].shippingAddress,
          createdAt: newOrder[0].createdAt,
        },
      });
    } catch (error) {
      // === FIX LỖI TRANSACTION: chỉ abort nếu chưa commit ===
      try {
        await session.abortTransaction();
      } catch (error) {
        console.warn("Abort failed (already committed?):", abortError.message);
      }

      console.error("Create Order Error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Đặt hàng thất bại!",
      });
    } finally {
      session.endSession();
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

  static async searchOrders(req, res) {
    try {
      const { userId } = req.query;
      const orders = await Order.find({ userId })
        .select(
          "orderId totalAmount status paymentStatus createdAt items.name items.quantity items.price"
        )
        .populate("items.productId", "name image price discountPrice")
        .sort({ createdAt: -1 });

      if (!orders) {
        return res.status(404).json({
          success: false,
          message: "Không tồn tại đơn hàng",
        });
      }
      res.json({ success: true, orders });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
module.exports = OrderController;
