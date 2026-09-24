const Issue = require('../models/Issue');
const fs = require('fs');
const path = require('path');
const { isCloudinaryConfigured } = require('../config/cloudinary');

// @desc    Get all issues with optional filtering
// @route   GET /api/issues
// @access  Public
const getIssues = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { landmark: { $regex: search, $options: 'i' } },
      ];
    }

    const issues = await Issue.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch issues',
      error: error.message,
    });
  }
};

// @desc    Create a new issue
// @route   POST /api/issues
// @access  Public
const createIssue = async (req, res) => {
  try {
    const { title, description, category, landmark } = req.body;

    if (!title || !description || !category || !landmark) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, category, and landmark.',
      });
    }

    let imageUrl;

    if (req.file) {
      if (isCloudinaryConfigured) {
        imageUrl = req.file.path;
      } else {
        // Local static file path URL
        const protocol = req.protocol;
        const host = req.get('host');
        imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
      }
    }

    const newIssue = await Issue.create({
      title,
      description,
      category,
      landmark,
      ...(imageUrl && { imageUrl }),
    });

    res.status(201).json({
      success: true,
      message: 'Civic issue reported successfully!',
      data: newIssue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create issue',
      error: error.message,
    });
  }
};

// @desc    Update an issue's details
// @route   PUT /api/issues/:id
// @access  Public / Admin
const updateIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, landmark, status } = req.body;

    let issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    let updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(category && { category }),
      ...(landmark && { landmark }),
      ...(status && { status }),
    };

    if (req.file) {
      if (isCloudinaryConfigured) {
        updateData.imageUrl = req.file.path;
      } else {
        const protocol = req.protocol;
        const host = req.get('host');
        updateData.imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
      }
    }

    const updatedIssue = await Issue.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Issue updated successfully',
      data: updatedIssue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update issue',
      error: error.message,
    });
  }
};

// @desc    Update issue status specifically
// @route   PATCH /api/issues/:id/status
// @access  Admin
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'In Progress', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
      });
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedIssue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Status updated to '${status}' successfully`,
      data: updatedIssue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
      error: error.message,
    });
  }
};

// @desc    Delete an issue
// @route   DELETE /api/issues/:id
// @access  Public / Admin
const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    // If local file, optionally delete from uploads directory
    if (!isCloudinaryConfigured && issue.imageUrl && issue.imageUrl.includes('/uploads/')) {
      const filename = issue.imageUrl.split('/uploads/')[1];
      if (filename) {
        const filePath = path.join(__dirname, '../uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    await Issue.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Issue deleted successfully',
      data: { id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete issue',
      error: error.message,
    });
  }
};

module.exports = {
  getIssues,
  createIssue,
  updateIssue,
  updateStatus,
  deleteIssue,
};
