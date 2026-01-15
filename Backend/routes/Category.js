const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/CategoryController");

router.get("/", CategoryController.getCategories);
router.get("/subcategories", CategoryController.getAllSubCategories);
router.get("/subcategories/:categoryId", CategoryController.getSubCategories);
router.post("/", CategoryController.createCategory);
router.put("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);
router.post("/seed", CategoryController.seed);
router.get("/by-value/:value", CategoryController.getByValue);

module.exports = router;
