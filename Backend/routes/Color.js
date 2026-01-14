// backend/routes/colorRoutes.js
const express = require("express");
const router = express.Router();
const ColorController = require("../controllers/ColorController");

router.get("/", ColorController.getColos);
router.get("/:id", ColorController.getColorById);
router.post("/", ColorController.createColor);
router.put("/:id", ColorController.updateColor);
router.delete("/:id", ColorController.deleteColor);
router.post("/seed", ColorController.seed); // route seed

module.exports = router;
