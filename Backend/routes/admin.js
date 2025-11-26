// backend/routes/admin.js
const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/AdminController");

const { protect, adminOnly } = require("../middleware/auth");

// PUBLIC: Đăng nhập admin
router.post("/login", AdminController.login);

// PROTECTED: Chỉ admin mới vào được
router.use(protect);
router.use(adminOnly);

router.post("/logout", AdminController.logout);
router.get("/me", AdminController.me);
router.get("/users", AdminController.getUsers);

// Thống kê
router.get("/stats", AdminController.getAllDashBoardStats);

// Quản lý đơn hàng
router.get("/orders", AdminController.getAllOrders);
router.patch("/orders/:id/status", AdminController.updateOrderStatus);

// Quản lý sản phẩm
router.get("/products", AdminController.getProducts);
router.get("/products/:id", AdminController.getProductById);
router.post("/products", AdminController.createProduct);
router.put("/products/:id", AdminController.updateProduct);
router.delete("/products/:id", AdminController.deleteProduct);

module.exports = router;
