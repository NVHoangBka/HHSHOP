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
const paymentRouter = require("./Payment");
const adminRouter = require("./admin");
const userRouter = require("./User");
const tagRouter = require("./Tag");
const newRouter = require("./New");
const categoryRouter = require("./Category");
const colorRoutes = require("./Color");
const typeRoutes = require("./Type");
const brandRoutes = require("./Brand");
const storeRoutes = require("./Store");
// const searchRouter = require("./Search");

router.use("/auth", authRouter);
router.use("/addresses", addressRouter);
router.use("/orders", orderRouter);
router.use("/products", productRouter);
router.use("/titles", titleRouter);
router.use("/banners", bannerRouter);
router.use("/cart", cartRouter);
router.use("/payment", paymentRouter);
router.use("/admin", adminRouter);
router.use("/users", userRouter);
router.use("/news", newRouter);
router.use("/tags", tagRouter);
router.use("/categories", categoryRouter);
router.use("/colors", colorRoutes);
router.use("/types", typeRoutes);
router.use("/brands", brandRoutes);
router.use("/stores", storeRoutes);
// router.use("/search", searchRouter);

module.exports = router;
