// Backend/routes/Upload.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Tạo thư mục uploads
const uploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error("Chỉ chấp nhận file ảnh!"));
  },
});

// QUAN TRỌNG: DÙNG .array() ĐỂ HỖ TRỢ NHIỀU ẢNH
router.post("/", upload.array("images", 20), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Chưa chọn ảnh nào" });
    }

    const urls = Array.isArray(req.files)
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    res.json({ success: true, urls }); // urls là mảng → frontend .join() ngon lành
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
