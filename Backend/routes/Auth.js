const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const { protect } = require("../middleware/auth");

// ĐÚNG
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.get("/me", protect, AuthController.getCurrentUser);
router.post("/logout", protect, AuthController.logout);
router.get("/users", protect, AuthController.getUsers);
router.post("/change-password", protect, AuthController.changePassword);

// QUÊN MẬT KHẨU - GỬI EMAIL
router.post("/recover-password", AuthController.forgotPassword);

// ĐẶT LẠI MẬT KHẨU - TỪ LINK
router.post("/reset-password/:token", AuthController.resetPassword); // SỬA THÀNH resetPassword

module.exports = router;
