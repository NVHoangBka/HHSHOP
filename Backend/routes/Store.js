// backend/routes/Cart.js
const express = require("express");
const router = express.Router();
const StoreController = require("../controllers/StoreController");

router.get("/", StoreController.getAllStores);
router.post("/add", StoreController.createStore);
router.put("/update", StoreController.updateStore);
router.delete("/remove/:productId", StoreController.deleteStore);
router.post("/seed", StoreController.seed);

module.exports = router;
