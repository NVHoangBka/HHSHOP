// backend/config/cloudinary.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

console.log(
  "Cloudinary config - cloud_name:",
  process.env.CLOUDINARY_CLOUD_NAME,
); // ← debug
console.log("API key exists:", !!process.env.CLOUDINARY_API_KEY);
console.log("API secret exists:", !!process.env.CLOUDINARY_API_SECRET);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // secure: true,            // optional, nhưng khuyến khích dùng https
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    return {
      folder: "brands-logos", // tổ chức folder rõ ràng
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      public_id: `brand-${Date.now()}-${file.originalname.split(".")[0]}`,
      // transformation: [{ width: 500, height: 500, crop: "limit" }], // optional resize
    };
  },
});

const uploadCloud = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // giới hạn 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Chỉ chấp nhận file ảnh!"), false);
    }
    cb(null, true);
  },
});

module.exports = uploadCloud;
