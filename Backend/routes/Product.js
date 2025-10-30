// backend/routes/Product.js
const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

router.get('/', ProductController.getAll);
router.get('/title/:title', ProductController.getByTitle);
router.get('/subtitle/:subtitle', ProductController.getBySubTitle);
router.get('/tag/:tag', ProductController.getByTag);
router.get('/type/:type', ProductController.getByType);

module.exports = router;