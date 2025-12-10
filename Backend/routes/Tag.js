// backend/routes/Tag.js
const express = require("express");
const router = express.Router();
const TagController = require("../controllers/TagController");

// PUBLIC - Lấy tất cả tag (có filter)
router.get("/", TagController.getAllTags);

// PUBLIC - Trang tag chung: cả sản phẩm + bài viết
router.get("/:slug", TagController.getTagDetail); // /tag/chong-lao-hoa

module.exports = router;
