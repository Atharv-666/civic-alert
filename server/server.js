const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const issueRoutes = require('./routes/issueRoutes');

// Connect to Database and Auto-seed if empty
const Issue = require('./models/Issue');

connectDB().then(async () => {
  try {
    const count = await Issue.countDocuments();
    if (count === 0) {
      console.log('No issues found in MongoDB. Seeding initial sample civic issues...');
      const sampleIssues = [
        {
          title: 'Massive pothole cluster near Salokhenagar Water Tank',
          description: 'Deep crater-like potholes formed right at the main crossroad near Salokhenagar water tank. Two-wheelers frequently skid during night hours.',
          category: 'Pothole',
          landmark: 'Near Water Tank, Main Road, Salokhenagar, Kolhapur',
          imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
          status: 'Pending',
          createdAt: new Date(Date.now() - 3600000 * 24 * 2),
        },
        {
          title: 'Overflowing municipal garbage bin along Rankala Chaupati',
          description: 'Waste container overflowing with plastic wrappers, food containers, and dry leaves onto the pedestrian walking track. Causing foul odor.',
          category: 'Garbage',
          landmark: 'Rankala Lake Chaupati, Opp. Padmaraje Garden, Kolhapur',
          imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
          status: 'In Progress',
          createdAt: new Date(Date.now() - 3600000 * 24 * 1),
        },
        {
          title: 'Damaged street light pole causing complete blackout',
          description: 'Street lamp pole tilted and electrical junction box exposed. Lights have been non-functional for 4 consecutive nights.',
          category: 'Streetlight',
          landmark: 'Rajampuri 2nd Lane, Near Janata Sahakari Bank, Kolhapur',
          imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
          status: 'Resolved',
          createdAt: new Date(Date.now() - 3600000 * 24 * 4),
        },
        {
          title: 'Choked storm drainage line flooding service road',
          description: 'Rainwater drainage blocked by construction debris and plastic bottles, causing dirty drain water to pool onto the road.',
          category: 'Drainage',
          landmark: 'Old Pune-Bangalore Road, Near Central Bus Stand (CBS), Kolhapur',
          imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
          status: 'Pending',
          createdAt: new Date(Date.now() - 3600000 * 12),
        },
        {
          title: 'Broken concrete slab over open gutter',
          description: 'The foot-over concrete slab covering the stormwater drain is cracked and collapsed, posing a major fall hazard for pedestrians.',
          category: 'Other',
          landmark: 'University Road, Near Shivaji University Main Gate, Kolhapur',
          imageUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
          status: 'In Progress',
          createdAt: new Date(Date.now() - 3600000 * 5),
        },
      ];
      await Issue.insertMany(sampleIssues);
      console.log('Sample civic issues seeded successfully!');
    }
  } catch (err) {
    console.error('Auto-seeding error:', err.message);
  }
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files fallback
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/issues', issueRoutes);

// Health Check API
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Civic Alert API Server running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(` Civic Alert Server Running       `);
  console.log(` Port: ${PORT}                    `);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'} `);
  console.log(`=================================`);
});
