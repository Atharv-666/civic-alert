const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

/**
 * AI Assistant Endpoints
 */

// Auto-fill report form fields based on prompt or input
router.post('/auto-fill', aiController.autoFillReport);

// Conversational AI Assistant
router.post('/chat', aiController.chatWithAi);

module.exports = router;
