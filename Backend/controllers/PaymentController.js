// backend/controllers/paymentController.js
const PaymentQR = require("../models/PaymentQR");
const Order = require("../models/Order");
const axios = require("axios");

const generateQR = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "Đơn hàng đã thanh toán" });
    }

    if (order.paymentMethod !== "BANK") {
      return res
        .status(400)
        .json({ message: "Đơn hàng không dùng chuyển khoản" });
    }

    // Kiểm tra đã tạo QR chưa
    let paymentQR = await PaymentQR.findOne({ orderId: order._id });
    if (paymentQR) {
      return res.json({
        success: true,
        qrImage: paymentQR.qrBase64,
        bankInfo: paymentQR.bankInfo,
        expiredAt: paymentQR.expiredAt,
      });
    }

    // === THÔNG TIN NGÂN HÀNG (có thể đưa ra config sau) ===
    const BANK_ACCOUNT = "0385427179";
    const ACCOUNT_NAME = "NGUYEN VAN HOANG";
    const BANK_NAME = "MB BANK";

    // Tạo QR mới
    const content = `Thanh toan don ${order.orderId}`;
    const totalAmount = order.totalAmount;

    const qrUrl = `https://img.vietqr.io/image/mb-${BANK_ACCOUNT}-compact2.jpg?amount=${totalAmount}&addInfo=${encodeURIComponent(
      content
    )}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

    const response = await axios.get(qrUrl, { responseType: "arraybuffer" });
    const qrBase64 = `data:image/png;base64,${Buffer.from(
      response.data
    ).toString("base64")}`;

    // Lưu vào DB
    paymentQR = new PaymentQR({
      orderId: order._id,
      orderCode: order.orderId,
      totalAmount,
      qrImageUrl: qrUrl,
      qrBase64,
      bankInfo: {
        bin: "970422",
        bankName: BANK_NAME,
        accountNumber: BANK_ACCOUNT,
        accountName: ACCOUNT_NAME,
        content,
      },
      expiredAt: new Date(Date.now() + 15 * 60 * 1000), // hết hạn sau 15 phút
      status: "pending",
    });

    await paymentQR.save();

    // Cập nhật đơn hàng có QR
    order.paymentQR = paymentQR._id;
    order.paymentMethod = "BANK";
    order.paymentStatus = "pending";
    await order.save();

    res.json({
      success: true,
      qrImage: qrBase64,
      bankInfo: paymentQR.bankInfo,
      expiredAt: paymentQR.expiredAt,
    });
  } catch (error) {
    console.error("Lỗi tạo QR:", error.message);
    res.status(500).json({ success: false, message: "Không thể tạo QR" });
  }
};

module.exports = { generateQR };
