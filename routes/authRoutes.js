const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

/**
 * Public User Auth Routes (/api/auth)
 */

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
