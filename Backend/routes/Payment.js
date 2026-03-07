const express = require("express");
const router = express.Router();
const { generateQR } = require("../controllers/PaymentController");
const { protect } = require("../middleware/auth");

router.post("/generate-qr", protect, generateQR);

module.exports = router;
