// backend/middleware/upload.js
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Config Cloudinary chỉ khi cần (tránh crash lúc import)
let isCloudinaryConfigured = false;

function configureCloudinary() {
  if (isCloudinaryConfigured) return;

  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new Error("Missing Cloudinary environment variables");
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    console.log("Cloudinary configured successfully");
    console.log("Cloud name used:", process.env.CLOUDINARY_CLOUD_NAME);
    console.log("Cloud name used:", process.env.CLOUDINARY_API_KEY);
    console.log("Cloud name used:", process.env.CLOUDINARY_API_SECRET);
    isCloudinaryConfigured = true;
  } catch (err) {
    console.error("Cloudinary configuration FAILED:", err.message);
    throw err; // ném ra để server biết có vấn đề
  }
}

// Storage (gọi configure khi tạo storage)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Đảm bảo config trước khi upload
    configureCloudinary();

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
