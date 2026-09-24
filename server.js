const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const issueRoutes = require('./routes/issueRoutes');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');

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
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive CORS for development preview
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Clerk-User-Id', 'X-User-Role', 'X-User-Name', 'X-User-Email']
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ==========================================================================
   DATABASE CONNECTION (MongoDB Atlas)
   ========================================================================== */
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/civic_alert_salokhenagar';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully.');
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB Connection Warning:', err.message);
    console.log('ℹ️ Running in memory-buffered mode. Connect MongoDB Atlas URI for persistent storage.');
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
  app.listen(PORT, () => {
    console.log(`🚀 Civic Alert Server active on http://localhost:${PORT}`);
    console.log(`📍 Serving Salokhenagar, Kolhapur Community Issue Platform`);
  });
}

module.exports = app;
