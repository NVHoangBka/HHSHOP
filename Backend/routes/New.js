// backend/routes/New.js
const express = require("express");
const router = express.Router();
const NewController = require("../controllers/NewController");

// PUBLIC
router.get("/", NewController.getAll); // danh sách + phân trang
router.get("/featured", NewController.getFeatured); // tin nổi bật
router.get("/tag/:slug", NewController.getByTag); // /tin-tuc/tag/chong-lao-hoa
router.get("/slug/:slug", NewController.getBySlug); // chi tiết bài
router.get("/search", NewController.search); // tìm bài viết

module.exports = router;
