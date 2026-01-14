// backend/routes/Category.js
const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/CategoryController");

router.get("/", CategoryController.getCategories);
router.get("/subcategories", CategoryController.getSubCategories);
router.post("/seed", CategoryController.seed);

module.exports = router;
