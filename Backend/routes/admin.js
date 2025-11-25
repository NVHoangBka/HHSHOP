const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");
const { protect } = require("../middleware/auth");

// ĐÚNG
router.post("/login", AdminController.login);
router.post("/logout", protect, AdminController.logout);
router.get("/users", protect, AdminController.getUsers);

module.exports = router;
