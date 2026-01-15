// backend/routes/Product.js
const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");

router.get("/", ProductController.getAll);
router.get("/title/:title", ProductController.getByTitle);
router.get("/subtitle/:subtitle", ProductController.getBySubTitle);
router.get("/tag/:tag", ProductController.getByTag);
router.get("/type/:type", ProductController.getByType);
router.get("/category/:categoryId", ProductController.getByCategory);
router.get("/subcategory/:subCategoryId", ProductController.getBySubCategory);
router.post("/seed", ProductController.seed);
router.get("/search/live", ProductController.search);
router.get("/slug/:slug", ProductController.getBySlug);

module.exports = router;
