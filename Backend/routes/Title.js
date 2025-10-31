// backend/routes/Title.js
const express = require('express');
const router = express.Router();
const TitleController = require('../controllers/TitleController');

router.get('/', TitleController.getAll);

module.exports = router;