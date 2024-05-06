const express = require('express');
const { getAllOrders, getOrderById } = require('../controller/orderController');

const router = express.Router();

router.get('/',getAllOrders);
router.get('/:orderId',getOrderById)

module.exports = router;