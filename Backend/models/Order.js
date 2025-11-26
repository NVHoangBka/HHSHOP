// backend/models/Order.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true }, // snapshot tên sản phẩm
    image: { type: String, required: true }, // ảnh lúc mua
    price: { type: Number, required: true, min: 0 }, // giá lúc mua
    discountPrice: { type: Number, min: 0 }, // nếu có khuyến mãi
    quantity: { type: Number, required: true, min: 1 },
    variant: { type: String }, // "Chai 900g", "Hương chanh", v.v.
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    orderId: { type: String, required: true, unique: true, index: true },

    shippingAddress: {
      recipientName: String,
      phoneNumber: String,
      addressLine: String,
      ward: String,
      district: String,
      city: String,
    },

    // === SẢN PHẨM TRONG ĐƠN ===
    items: [orderItemSchema],

    // === TỔNG TIỀN ===
    subtotal: { type: Number, required: true, min: 0 }, // tiền hàng
    shippingFee: { type: Number, default: 0 },
    voucherCode: String,
    voucherDiscount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true, min: 0 }, // cuối cùng khách trả

    note: String,

    // === THANH TOÁN ===
    paymentMethod: {
      type: String,
      enum: ["COD", "BANK"],
      default: "COD",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paidAt: Date,

    // Liên kết với QR
    paymentQR: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentQR",
      default: null,
    },

    // === TRẠNG THÁI ĐƠN HÀNG ===
    status: {
      type: String,
      enum: [
        "pending", // chờ xác nhận
        "confirmed", // đã xác nhận
        "preparing", // đang đóng gói
        "shipped", // đã giao cho đơn vị vận chuyển
        "delivered", // đã giao thành công
        "canceled", // đã hủy
        "returned", // khách trả hàng
      ],
      default: "pending",
      index: true, // lọc đơn theo trạng thái nhanh
    },

    // === THỜI GIAN CHI TIẾT ===
    confirmedAt: Date,
    preparingAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    canceledAt: Date,
    returnedAt: Date,
  },
  { timestamps: true }
);

// === INDEX TÌM KIẾM NHANH ===
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderId: 1 });

module.exports = mongoose.model("Order", orderSchema);
