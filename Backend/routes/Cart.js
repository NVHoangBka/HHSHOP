// backend/routes/Cart.js
const express = require("express");
const router = express.Router();
const CartController = require("../controllers/CartController");
const { protect } = require("../middleware/auth");

router.use(protect); // BẮT BUỘC ĐĂNG NHẬP

router.get("/", CartController.getCart);
router.post("/add", CartController.addItem);
router.put("/update", CartController.updateItem);
router.delete("/remove/:productId", CartController.removeItem);
router.delete("/clear", CartController.clearCart);

module.exports = router;
