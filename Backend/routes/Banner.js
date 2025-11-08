// backend/routes/Banner.js
const express = require("express");
const router = express.Router();
const BannerController = require("../controllers/BannerController");

router.get("/", BannerController.getAll);

module.exports = router;
