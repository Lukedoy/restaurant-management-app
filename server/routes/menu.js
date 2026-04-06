const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { requireFields, validateObjectId, validateRange } = require('../middleware/validate');

router.get('/', menuController.getAllMenuItems);
router.get('/:id', validateObjectId(), menuController.getMenuItemById);

router.post('/', auth, adminOnly,
  requireFields('name', 'category', 'price'),
  validateRange('price', 0.01, 10000),
  validateRange('preparationTime', 1, 180),
  menuController.createMenuItem
);

router.put('/:id', auth, adminOnly,
  validateObjectId(),
  validateRange('price', 0.01, 10000),
  menuController.updateMenuItem
);

router.delete('/:id', auth, adminOnly,
  validateObjectId(),
  menuController.deleteMenuItem
);

module.exports = router;
