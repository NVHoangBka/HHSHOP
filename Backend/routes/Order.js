// backend/routes/Order.js
const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const { protect } = require("../middleware/auth");

router.use(protect);
// GET: LẤY DANH SÁCH ĐƠN HÀNG CỦA USER
router.post("/", protect, OrderController.createOrder);
router.get("/", protect, OrderController.getOrders);
router.get("/:orderId", protect, OrderController.getOrderDetail);

module.exports = router;
