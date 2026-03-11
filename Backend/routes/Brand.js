// backend/routes/colorRoutes.js
const express = require("express");
const router = express.Router();
const BrandController = require("../controllers/BrandController");

router.get("/", BrandController.getAllBrands);

module.exports = router;
