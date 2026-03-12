// backend/routes/admin.js
const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/AdminController");

const { adminProtect } = require("../middleware/admin");
const {
  uploadBrandLogo,
  uploadProductImages,
} = require("../config/cloudinary");
// const { uploadBrand, uploadProduct } = require("../middleware/upload");

// PUBLIC: Đăng nhập admin
router.post("/login", AdminController.login);
router.post("/logout", AdminController.logout);
router.post("/refresh-token", AdminController.refreshToken);

// PROTECTED: Chỉ admin mới vào được
router.use(adminProtect);

router.get("/me", AdminController.getCurrentAdmin);
router.get("/users", AdminController.getUsersAllAdmin);

// // // Thống kê
// router.get("/stats", AdminController.getAllDashBoardStats);

// // // Quản lý đơn hàng
router.get("/orders", AdminController.getOrdersAllAdmin);
router.put("/orders/:id/status", AdminController.updateOrderStatus);
router.put(
  "/orders/:id/payment-status",
  AdminController.updateOrderPaymentStatus,
);

// // Quản lý sản phẩm
router.get("/products", AdminController.getProductsAllAdmin);

router.post("/upload", uploadProductImages, (req, res) => {
  try {
    const urls = [];
    if (req.files?.mainImage?.[0]) urls.push(req.files.mainImage[0].path);
    if (req.files?.galleryImages?.length) {
      urls.push(...req.files.galleryImages.map((f) => f.path));
    }
    res.json({ success: true, urls });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post(
  "/products",
  uploadProductImages,
  AdminController.createProductAdmin,
);
router.put(
  "/products/:id",
  uploadProductImages,
  AdminController.updateProductAdmin,
);
router.delete("/products/:id", AdminController.deleteProductAdmin);

// ==================== QUẢN LÝ TIN TỨC (NEWS) ====================
router.get("/news", AdminController.getNewsAdmin);
router.post("/news", AdminController.createNew);
router.put("/news/:id", AdminController.updateNew);
router.delete("/news/:id", AdminController.deleteNew);

// ==================== QUẢN LÝ TAG ====================
router.get("/tags", AdminController.getTagsAdmin);
router.post("/tags", AdminController.createTag);
router.put("/tags/:id", AdminController.updateTag);
router.delete("/tags/:id", AdminController.deleteTag);

// ==================== QUẢN LÝ BRAND ====================
router.get("/brands", AdminController.getBrandsAdmin);
router.post("/brands", uploadBrandLogo, AdminController.createBrand);
router.put("/brands/:id", uploadBrandLogo, AdminController.updateBrand);
router.delete("/brands/:id", AdminController.deleteBrand);

module.exports = router;
