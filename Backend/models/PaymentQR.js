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

    // === MÃ ĐƠN HÀNG (từ ngân hàng hoặc Momo) ===
    orderCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // === SỐ TIỀN ===
    amount: {
      type: Number,
      required: true,
      min: [1000, "Số tiền tối thiểu 1.000₫"],
    },

    // === QR CODE ===
    qrImageUrl: { type: String },
    qrBase64: { type: String },

    // === THÔNG TIN NGÂN HÀNG / VÍ ===
    bankInfo: {
      bin: String, // 970415 (Vietcombank), 970422 (Techcombank)...
      bankName: String,
      accountNumber: String,
      accountName: { type: String, uppercase: true },
      content: String, // nội dung chuyển khoản (rất quan trọng!)
    },

    // === TRẠNG THÁI QR ===
    status: {
      type: String,
      enum: ["pending", "scanned", "paid", "expired", "canceled"],
      default: "pending",
      index: true,
    },

    // === THỜI GIAN ===
    expiredAt: {
      type: Date,
      required: true,
      index: true, // tìm QR hết hạn nhanh
    },
    scannedAt: Date,
    paidAt: Date,
    canceledAt: Date,

    // === GHI CHÚ (nếu cần) ===
    note: String,
  },
  { timestamps: true }
);

// === TỰ ĐỘNG XÓA QR HẾT HẠN (tùy chọn - chạy bằng cron job) ===
paymentQRSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

// === TÌM KIẾM NHANH ===
paymentQRSchema.index({ orderCode: 1 });
paymentQRSchema.index({ status: 1 });
paymentQRSchema.index({ "bankInfo.accountNumber": 1 });

module.exports = mongoose.model("PaymentQR", paymentQRSchema);
