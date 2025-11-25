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

    // Thông tin tài khoản MB Bank
    const bankAccount = "0385427179";
    const accountName = "NGUYEN%20VAN%20HOANG";

    // Tạo QR mới
    const content = `Thanh toan don ${order.orderId}`;
    const qrUrl = `https://img.vietqr.io/image/mb-${bankAccount}-compact2.jpg?amount=${
      order.total
    }&addInfo=${encodeURIComponent(content)}&accountName=${accountName}`;

    const response = await axios.get(qrUrl, { responseType: "arraybuffer" });
    const qrBase64 = `data:image/png;base64,${Buffer.from(
      response.data
    ).toString("base64")}`;

    // Lưu vào DB
    paymentQR = new PaymentQR({
      orderId: order._id,
      orderCode: order.orderId,
      amount: order.total,
      qrImageUrl: qrUrl,
      qrBase64,
      bankInfo: {
        bank: "MB BANK",
        accountNumber: "0385427179",
        accountName: "NGUYEN VAN HOANG",
        content,
      },
      expiredAt: new Date(Date.now() + 15 * 60 * 1000), // hết hạn sau 15 phút
    });

    await paymentQR.save();

    // Cập nhật đơn hàng có QR
    order.paymentQR = paymentQR._id;
    order.paymentMethod = "BANK";
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
