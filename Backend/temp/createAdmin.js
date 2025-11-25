// backend/createAdmin.js
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/User");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Đang tạo tài khoản Admin...");

    const admin = await User.findOneAndUpdate(
      { email: "admin@hhshop.vn" },
      {
        $set: {
          firstName: "Admin",
          lastName: "HHSHOP",
          email: "admin@hhshop.vn",
          password: "admin123", // ← SẼ TỰ ĐỘNG HASH NHỜ PRE("save")
          phoneNumber: "0385427179",
          role: "admin", // ← QUAN TRỌNG NHẤT
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log("TÀI KHOẢN ADMIN ĐÃ SẴN SÀNG!");
    console.log("Email: admin@hhshop.vn");
    console.log("Mật khẩu: admin123");
    console.log("Role:", admin.role);

    process.exit();
  })
  .catch((err) => {
    console.error("Lỗi:", err);
    process.exit(1);
  });
