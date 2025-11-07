// backend/config/email.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "hoangdo.bka@gmail.com", // THAY BẰNG EMAIL CỦA BẠN
    pass: "ntmv rate hgxp zoho", // DÙNG APP PASSWORD (không dùng mật khẩu thường)
  },
});

module.exports = transporter;
