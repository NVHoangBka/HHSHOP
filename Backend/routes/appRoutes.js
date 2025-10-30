// backend/routes/appRoutes.js
const express = require('express');
const router = express.Router();

const auth = require('./Auth');
const address = require('./Address');
const order = require('./Order');
const product = require('./Product');

router.use('/auth', auth);
router.use('/addresses', address);
router.use('/orders', order);
router.use('/products', product); 

module.exports = router;