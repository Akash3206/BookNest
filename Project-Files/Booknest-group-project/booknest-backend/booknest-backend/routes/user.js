const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/wishlist', authMiddleware, userController.getWishlist);
router.post('/wishlist', authMiddleware, userController.toggleWishlist);

module.exports = router; 