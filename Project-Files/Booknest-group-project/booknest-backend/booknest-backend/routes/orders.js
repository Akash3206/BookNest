const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/place', authMiddleware, orderController.placeOrder);
router.get('/my', authMiddleware, orderController.getUserOrders);
router.get('/', authMiddleware, adminMiddleware, orderController.getAllOrders);
router.put('/:id', authMiddleware, adminMiddleware, orderController.updateOrderStatus);

module.exports = router; 