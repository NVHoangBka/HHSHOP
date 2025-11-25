// backend/models/Order.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  name: String,
  image: String,
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: { type: String, required: true, unique: true },

    address: {
      recipientName: String,
      phoneNumber: String,
      addressLine: String,
      ward: String,
      district: String,
      city: String,
    },

    items: [orderItemSchema],

    total: { type: Number, required: true, min: 0 },

    note: String,
    voucherCode: String,
    voucherDiscount: { type: Number, default: 0 },

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
        "pending",
        "confirmed",
        "preparing",
        "shipped",
        "delivered",
        "canceled",
      ],
      default: "pending",
    },

    confirmedAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    canceledAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
