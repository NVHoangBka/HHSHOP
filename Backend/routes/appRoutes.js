// backend/routes/appRoutes.js
const express = require("express");
const router = express.Router();

const authRouter = require("./Auth");
const addressRouter = require("./Address");
const orderRouter = require("./Order");
const productRouter = require("./Product");
const titleRouter = require("./Title");
const bannerRouter = require("./Banner");
const cartRouter = require("./Cart");

router.use("/auth", authRouter);
router.use("/addresses", addressRouter);
router.use("/orders", orderRouter);
router.use("/products", productRouter);
router.use("/titles", titleRouter);
router.use("/banners", bannerRouter);
router.use("/cart", cartRouter);

module.exports = router;
