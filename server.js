const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const issueRoutes = require('./routes/issueRoutes');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

/* ==========================================================================
   CORS CONFIGURATION (Render Backend <-> Vercel Frontend Interop)
   ========================================================================== */
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CLIENT_URL // Vercel Frontend Production URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true); // Permissive CORS for smooth interop
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Clerk-User-Id', 'X-User-Role', 'X-User-Name', 'X-User-Email', 'X-Auth-Token']
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ==========================================================================
   DATABASE CONNECTION & AUTO-ADMIN SEEDING
   ========================================================================== */
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/civic_alert_salokhenagar';

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas successfully.');
    
    // Auto-seed initial admin account if not already created
    try {
      const adminEmail = (process.env.ADMIN_EMAIL || 'admin@salokhenagar.org').toLowerCase();
      const existingAdmin = await User.findOne({ email: adminEmail });
      if (!existingAdmin) {
        const newAdmin = new User({
          name: process.env.ADMIN_NAME || 'Salokhenagar Municipal Admin',
          email: adminEmail,
          password: process.env.ADMIN_PASSWORD || 'Admin@12345',
          role: 'admin'
        });
        await newAdmin.save();
        console.log(`🎉 Auto-seeded initial admin account: ${adminEmail}`);
      }
    } catch (seedErr) {
      console.warn('⚠️ Auto-seed admin warning:', seedErr.message);
    }
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB Connection Warning:', err.message);
  });

/* ==========================================================================
   API ROUTES
   ========================================================================== */
// Health Check Endpoint for Render deployment monitoring
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Civic Alert Backend API',
    location: 'Salokhenagar, Kolhapur',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/issues', issueRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin/auth', adminAuthRoutes);

// Fallback for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

/* ==========================================================================
   CENTRALIZED ERROR HANDLING MIDDLEWARE
   ========================================================================== */
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);

  // Handle Multer specific upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size limit exceeded. Maximum allowed size is 5MB.'
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

/* ==========================================================================
   SERVER INITIALIZATION
   ========================================================================== */
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Civic Alert Server active on port ${PORT}`);
    console.log(`📍 Serving Salokhenagar, Kolhapur Community Issue Platform`);
  });
}

module.exports = app;
