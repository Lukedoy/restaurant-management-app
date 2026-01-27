// routes/orders.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.post('/', auth, orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.put('/:id/status', auth, orderController.updateOrderStatus);
router.put('/:id/complete', auth, orderController.completeOrder);

module.exports = router;