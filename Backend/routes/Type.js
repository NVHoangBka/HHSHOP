// backend/routes/Tag.js
const express = require("express");
const router = express.Router();
const TypeController = require("../controllers/TypeController");

// PUBLIC - Lấy tất cả tag (có filter)
router.get("/", TypeController.getAllTypes);
router.post("/seed", TypeController.seed);

module.exports = router;
