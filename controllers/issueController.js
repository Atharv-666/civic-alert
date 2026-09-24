const Issue = require('../models/Issue');
const { uploadToCloudinary } = require('../config/cloudinary');

/**
 * @desc    Submit a new community issue report with image evidence
 * @route   POST /api/issues
 * @access  Private (Resident)
 */
exports.createIssue = async (req, res) => {
  try {
    const { title, description, landmark, category, priority, latitude, longitude } = req.body;

    // 1. Verify Image File Presence
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image evidence is required. Please upload a clear photo of the issue.'
      });
    }

    // 2. Upload Image Buffer to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer, 'civic-alert/reports');

    // 3. Construct GeoJSON Location if coordinates provided
    let locationData;
    if (latitude && longitude) {
      locationData = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      };
    }

    // 4. Construct Mongoose Document
    const issue = new Issue({
      title,
      description,
      landmark,
      category: category || 'Roads & Potholes',
      priority: priority || 'Medium',
      imageUrl: cloudinaryResult.secure_url,
      cloudinaryPublicId: cloudinaryResult.public_id,
      reportedBy: {
        clerkUserId: req.user.clerkUserId,
        name: req.user.name,
        email: req.user.email
      },
      location: locationData
    });

    // 5. Save Document to MongoDB Atlas
    const savedIssue = await issue.save();

    return res.status(201).json({
      success: true,
      message: 'Issue report submitted successfully to Salokhenagar municipal queue.',
      data: savedIssue
    });
  } catch (error) {
    console.error('Error creating issue report:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to process issue submission. Please try again later.'
    });
  }
};

/**
 * @desc    Get all community issues with search, filter, and pagination
 * @route   GET /api/issues
 * @access  Public
 */
exports.getAllIssues = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 10 } = req.query;

    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const issues = await Issue.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Issue.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: issues.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: issues
    });
  } catch (error) {
    console.error('Error fetching issue feed:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve community issue feed.'
    });
  }
};

/**
 * @desc    Get issues submitted by the logged-in resident
 * @route   GET /api/issues/my-reports
 * @access  Private (Resident)
 */
exports.getUserIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ 'reportedBy.clerkUserId': req.user.clerkUserId }).sort({
      createdAt: -1
    });

    return res.status(200).json({
      success: true,
      count: issues.length,
      data: issues
    });
  } catch (error) {
    console.error('Error fetching user issues:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve your reported issues.'
    });
  }
};

/**
 * @desc    Get single issue details with audit log
 * @route   GET /api/issues/:id
 * @access  Public
 */
exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue report not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: issue
    });
  } catch (error) {
    console.error('Error fetching issue by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Invalid issue ID or server error.'
    });
  }
};

/**
 * @desc    Update issue status (Pending -> In Progress -> Resolved) by Admin
 * @route   PATCH /api/issues/:id/status
 * @access  Private (Municipal Admin)
 */
exports.updateIssueStatus = async (req, res) => {
  try {
    const { status, comment, adminNotes, resolutionImageUrl } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'New status is required (Pending, In Progress, Resolved, Rejected).'
      });
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue report not found.'
      });
    }

    let proofImageUrl = resolutionImageUrl || null;

    // Handle Cloudinary upload if proof image file was provided
    if (req.file) {
      const cloudinaryResult = await uploadToCloudinary(req.file.buffer, 'civic-alert/resolutions');
      proofImageUrl = cloudinaryResult.secure_url;
    }

    // Execute state machine transition method
    await issue.updateStatus(
      status,
      {
        clerkUserId: req.user.clerkUserId,
        name: req.user.name
      },
      comment,
      proofImageUrl
    );

    if (adminNotes) {
      issue.adminNotes = adminNotes;
      await issue.save();
    }

    return res.status(200).json({
      success: true,
      message: `Issue status successfully updated to '${status}'.`,
      data: issue
    });
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update issue status.'
    });
  }
};

/**
 * @desc    Toggle community upvote for an issue
 * @route   POST /api/issues/:id/upvote
 * @access  Private (Resident)
 */
exports.toggleUpvoteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue report not found.'
      });
    }

    await issue.toggleUpvote(req.user.clerkUserId);

    return res.status(200).json({
      success: true,
      upvoteCount: issue.upvoteCount,
      hasUpvoted: issue.upvotedBy.includes(req.user.clerkUserId)
    });
  } catch (error) {
    console.error('Error toggling upvote:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record upvote.'
    });
  }
};

/**
 * @desc    Get dashboard metrics for Municipal Authorities
 * @route   GET /api/issues/stats/dashboard
 * @access  Private (Admin)
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await Issue.getDashboardStats();
    const totalIssues = await Issue.countDocuments();

    return res.status(200).json({
      success: true,
      totalIssues,
      stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate municipal dashboard statistics.'
    });
  }
};
