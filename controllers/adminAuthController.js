const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

/**
 * @desc    Authenticate Municipal Admin Officer
 * @route   POST /api/admin/auth/login
 * @access  Public (Admin Portal Only)
 */
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide administrator email and password.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator credentials.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator credentials.'
      });
    }

    // Strictly enforce role === 'admin'
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Not an administrator.'
      });
    }

    const token = generateToken(user._id, 'admin');

    return res.status(200).json({
      success: true,
      message: 'Admin authentication successful.',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process admin login.'
    });
  }
};

/**
 * @desc    Get currently logged-in admin profile
 * @route   GET /api/admin/auth/me
 * @access  Private (Admin Only)
 */
exports.getAdminMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin profile.'
    });
  }
};
