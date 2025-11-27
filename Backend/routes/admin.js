// backend/routes/admin.js
const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/AdminController");

const { adminProtect } = require("../middleware/admin");

// PUBLIC: Đăng nhập admin
router.post("/login", AdminController.login);
router.post("/logout", AdminController.logout);

// PROTECTED: Chỉ admin mới vào được
router.use(adminProtect);

router.get("/me", AdminController.getCurrentAdmin);
// router.post("/refresh-token", AdminController.refreshToken);
router.get("/users", AdminController.getUsersAllAdmin);

// // // Thống kê
// router.get("/stats", AdminController.getAllDashBoardStats);

// // // Quản lý đơn hàng
// router.get("/orders", AdminController.getOrdersAllAdmin);
// router.patch("/orders/:id/status", AdminController.updateOrderStatus);

// // Quản lý sản phẩm
// router.get("/products", AdminController.getProducts);
// router.get("/products/:id", AdminController.getProductById);
// router.post("/products", AdminController.createProduct);
// router.put("/products/:id", AdminController.updateProduct);
// router.delete("/products/:id", AdminController.deleteProduct);

module.exports = router;
