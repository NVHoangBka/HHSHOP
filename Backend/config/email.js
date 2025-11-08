// backend/config/email.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true cho port 465, false cho 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Test kết nối khi khởi động
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter lỗi:", error.message);
  } else {
    console.log("✅ Email transporter sẵn sàng!");
  }
});

module.exports = transporter;
