const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const { protect } = require("../middleware/auth");

router.get("/", protect, AuthController.getAddressAll);
router.post("/", protect, AuthController.addAddress);
router.put("/:addressId", protect, AuthController.updateAddress);
router.delete("/:addressId", protect, AuthController.deleteAddress);

module.exports = router;
