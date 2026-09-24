const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const upload = require('../middleware/upload');
const { requireAuth, requireAdmin } = require('../middleware/auth');

/**
 * Civic Alert REST API Endpoints
 */

// Public Community Feed
router.get('/', issueController.getAllIssues);

// Public Issue Detail
router.get('/details/:id', issueController.getIssueById);

// Citizen Protected Routes
router.post(
  '/',
  requireAuth,
  upload.single('image'), // Intercept multipart/form-data 'image' field
  issueController.createIssue
);

router.get('/my-reports', requireAuth, issueController.getUserIssues);
router.post('/:id/upvote', requireAuth, issueController.toggleUpvoteIssue);

// Municipal Authority Admin Routes
router.patch(
  '/:id/status',
  requireAuth,
  requireAdmin,
  upload.single('resolutionImage'),
  issueController.updateIssueStatus
);
router.get('/stats/dashboard', requireAuth, requireAdmin, issueController.getDashboardStats);

module.exports = router;
