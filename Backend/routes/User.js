//backend/routes/User.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.get("/all", UserController.getUsersAll);

module.exports = router;
