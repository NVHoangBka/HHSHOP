// backend/routes/admin.js
const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/AdminController");

const { adminProtect } = require("../middleware/admin");

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
  AdminController.updateOrderPaymentStatus
);

// // Quản lý sản phẩm
router.get("/products", AdminController.getProductsAllAdmin);
router.post("/products", AdminController.createProductAdmin);
router.put("/products/:id", AdminController.updateProductAdmin);
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

module.exports = router;
