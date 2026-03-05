// backend/routes/colorRoutes.js
const express = require("express");
const router = express.Router();
const BrandController = require("../controllers/BrandController");

router.get("/", BrandController.getAllBrands);
router.post("/seed", BrandController.seed);

module.exports = router;
