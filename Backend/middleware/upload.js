// backend/middleware/upload.js
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Config Cloudinary từ env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // luôn dùng https
});

// Storage cho upload
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    let folder = "hhshop/brands"; // cho logo brand
    if (file.fieldname === "images") {
      folder = "hhshop/products"; // cho sản phẩm
    }
    return {
      folder: folder,
      allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
      transformation: [
        { width: 1200, height: 1200, crop: "limit" }, // giới hạn kích thước
        { quality: "auto:good" }, // tự optimize
        { fetch_format: "auto" }, // tự WebP nếu hỗ trợ
      ],
      public_id: `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    };
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB để thoải mái hơn
});

console.log("Cloudinary config check:");
console.log("CLOUD_NAME:", !!process.env.CLOUDINARY_CLOUD_NAME);
console.log("API_KEY:", !!process.env.CLOUDINARY_API_KEY);
console.log("API_SECRET:", !!process.env.CLOUDINARY_API_SECRET);

module.exports = {
  uploadBrand: upload.single("logo"),
  uploadProduct: upload.array("images", 8), // max 8 ảnh sản phẩm
};
