// backend/routes/Category.js
const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/CategoryController");

router.get("/", CategoryController.getCategories);
router.get("/subcategories", CategoryController.getSubCategories);
router.post("/seed", CategoryController.seed);

// router.put("/update", CategoryController.updateItem);
// router.delete("/remove/:productId", CategoryController.removeItem);
// router.delete("/clear", CategoryController.clearCart);
module.exports = router;
