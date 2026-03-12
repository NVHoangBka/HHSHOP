// backend/middleware/upload.js
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// KHÔNG CẦN config thủ công nữa – Cloudinary SDK tự đọc CLOUDINARY_URL từ env

// Kiểm tra nhanh lúc load file (chỉ để debug)
console.log("CLOUDINARY_URL exists:", !!process.env.CLOUDINARY_URL);

// Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    console.log(
      "[CLOUDINARY PARAMS] Processing file:",
      file.originalname,
      file.size,
    );

    let folder = "hhshop/brands";
    if (file.fieldname === "images") {
      folder = "hhshop/products";
    }

    return {
      folder: folder,
      allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
      transformation: [
        { width: 1200, height: 1200, crop: "limit" },
        { quality: "auto:good" },
        { fetch_format: "auto" },
      ],
      public_id: `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    };
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = {
  uploadBrand: upload.single("logo"),
  uploadProduct: upload.array("images", 8),
};
