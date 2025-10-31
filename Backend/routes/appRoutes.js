// backend/routes/appRoutes.js
const express = require('express');
const router = express.Router();

const auth = require('./Auth');
const address = require('./Address');
const order = require('./Order');
const product = require('./Product');
const title = require('./Title');
const banner = require('./Banner');

router.use('/auth', auth);
router.use('/addresses', address);
router.use('/orders', order);
router.use('/products', product); 
router.use('/titles', title);
router.use('/banners', banner);

module.exports = router;