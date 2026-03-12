// backend/config/cloudinary.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    let folder = "general"; // default
    let public_id_prefix = "upload";
    let transformation = [];

    if (file.fieldname === "logo") {
      folder = "brands-logos";
      public_id_prefix = `brand-logo-${req.body.name ? req.body.name.trim().replace(/\s+/g, "-").toLowerCase() : Date.now()}`;
    } else if (file.fieldname === "mainImage") {
      folder = "products/main";
      public_id_prefix = `product-main-${req.body.slug || Date.now()}`;
      transformation = [
        { width: 1200, height: 1200, crop: "limit", quality: "auto:good" },
      ];
    } else if (file.fieldname === "galleryImages") {
      folder = "products/gallery";
      public_id_prefix = `product-gallery-${req.body.slug || Date.now()}-${file.originalname.split(".")[0]}`;
      transformation = [
        { width: 800, height: 800, crop: "fill", quality: "auto" },
      ];
    }
    return {
      folder: folder,
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      public_id: `${public_id_prefix}-${Date.now()}`,
      transformation: transformation,
    };
  },
});

const uploadCloud = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Chỉ chấp nhận file ảnh!"), false);
    }
    cb(null, true);
  },
});

module.exports = {
  uploadCloud, // dùng .single(), .array(), .fields()
  uploadBrandLogo: uploadCloud.single("logo"),
  uploadProductMain: uploadCloud.single("mainImage"),
  uploadProductGallery: uploadCloud.array("galleryImages", 8),
  uploadProductImages: uploadCloud.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 8 },
  ]),
};
