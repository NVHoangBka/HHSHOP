// backend/routes/Title.js
const express = require("express");
const router = express.Router();
const TitleController = require("../controllers/TitleController");

router.get("/", TitleController.getAll);
router.post("/seed", TitleController.seed);

module.exports = router;
