const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getIssues,
  createIssue,
  updateIssue,
  updateStatus,
  deleteIssue,
} = require('../controllers/issueController');

router.route('/')
  .get(getIssues)
  .post(upload.single('image'), createIssue);

router.route('/:id')
  .put(upload.single('image'), updateIssue)
  .delete(deleteIssue);

router.route('/:id/status')
  .patch(updateStatus);

module.exports = router;
