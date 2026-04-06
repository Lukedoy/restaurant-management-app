const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validate');

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.put('/:id/items', auth, validateObjectId(), orderController.updateOrderItems);
router.put('/:id/item-status', auth, validateObjectId(), orderController.updateItemStatus);
router.put('/:id/reassign-table', auth, validateObjectId(), orderController.reassignTable);
router.put('/:id/status', auth, validateObjectId(), orderController.updateOrderStatus);
router.put('/:id/payment', auth, validateObjectId(), orderController.processPayment);
router.put('/:id/complete', auth, validateObjectId(), orderController.completeOrder);

module.exports = router;
