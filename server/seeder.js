const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Issue = require('./models/Issue');
const connectDB = require('./config/db');

dotenv.config();

const kolhapurSampleIssues = [
  {
    title: 'Massive pothole cluster near Salokhenagar Water Tank',
    description: 'Deep crater-like potholes formed right at the main crossroad near Salokhenagar water tank. Two-wheelers frequently skid during night hours.',
    category: 'Pothole',
    landmark: 'Near Water Tank, Main Road, Salokhenagar, Kolhapur',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2), // 2 days ago
  },
  {
    title: 'Overflowing municipal garbage bin along Rankala Chaupati',
    description: 'Waste container overflowing with plastic wrappers, food containers, and dry leaves onto the pedestrian walking track. Causing foul odor.',
    category: 'Garbage',
    landmark: 'Rankala Lake Chaupati, Opp. Padmaraje Garden, Kolhapur',
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 3600000 * 24 * 1), // 1 day ago
  },
  {
    title: 'Damaged street light pole causing complete blackout',
    description: 'Street lamp pole tilted and electrical junction box exposed. Lights have been non-functional for 4 consecutive nights.',
    category: 'Streetlight',
    landmark: 'Rajampuri 2nd Lane, Near Janata Sahakari Bank, Kolhapur',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    status: 'Resolved',
    createdAt: new Date(Date.now() - 3600000 * 24 * 4), // 4 days ago
  },
  {
    title: 'Choked storm drainage line flooding service road',
    description: 'Rainwater drainage blocked by construction debris and plastic bottles, causing dirty drain water to pool onto the road.',
    category: 'Drainage',
    landmark: 'Old Pune-Bangalore Road, Near Central Bus Stand (CBS), Kolhapur',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 12), // 12 hours ago
  },
  {
    title: 'Broken concrete slab over open gutter',
    description: 'The foot-over concrete slab covering the stormwater drain is cracked and collapsed, posing a major fall hazard for pedestrians.',
    category: 'Other',
    landmark: 'University Road, Near Shivaji University Main Gate, Kolhapur',
    imageUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 3600000 * 5), // 5 hours ago
  },
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing issues
    await Issue.deleteMany();
    console.log('Cleared existing issues from MongoDB...');

    // Insert Kolhapur sample issues
    const createdIssues = await Issue.insertMany(kolhapurSampleIssues);
    console.log(`Successfully seeded ${createdIssues.length} Kolhapur civic issues into database!`);

    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
