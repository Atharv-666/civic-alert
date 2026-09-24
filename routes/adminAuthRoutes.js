const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

/**
 * Isolated Admin Auth Routes (/api/admin/auth)
 */

router.post('/login', adminAuthController.adminLogin);
router.get('/me', verifyToken, requireAdmin, adminAuthController.getAdminMe);

module.exports = router;
