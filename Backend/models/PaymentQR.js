// backend/models/PaymentQR.js
const mongoose = require("mongoose");

const paymentQRSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    orderCode: { type: String, required: true },
    amount: { type: Number, required: true },

    qrImageUrl: { type: String },
    qrBase64: { type: String },

    bankInfo: {
      bank: String,
      accountNumber: String,
      accountName: String,
      content: String,
    },

    status: {
      type: String,
      enum: ["pending", "scanned", "paid", "expired"],
      default: "pending",
    },

    expiredAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentQR", paymentQRSchema);
