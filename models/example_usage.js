/**
 * Example Usage & Test Demonstration for Civic Alert Issue Model
 * This file demonstrates how to instantiate, validate, query, and transition status using Issue.js
 */

const Issue = require('./Issue');

async function demo() {
  console.log('=== CIVIC ALERT (SALOKHENAGAR, KOLHAPUR) - MONGOOSE MODEL DEMO ===\n');

  // 1. Instantiating a new issue reported by a citizen in Salokhenagar
  const sampleReport = new Issue({
    title: 'Major Pothole on Water Tank Road',
    description: 'Deep pothole created due to recent heavy monsoon rains causing severe traffic slowdown and bike skidding risk near the water tank.',
    landmark: 'Opposite Salokhenagar Water Tank Gate, Ward No. 4, Salokhenagar, Kolhapur',
    category: 'Roads & Potholes',
    imageUrl: 'https://res.cloudinary.com/civic-alert/image/upload/v1700000000/pothole_salokhenagar.jpg',
    cloudinaryPublicId: 'pothole_salokhenagar_1700000000',
    priority: 'High',
    reportedBy: {
      clerkUserId: 'user_2N9zXkL3pQ8vR1aB',
      name: 'Amit Salokhe',
      email: 'amit.salokhe@example.com'
    },
    location: {
      type: 'Point',
      coordinates: [74.2415, 16.6892] // [Longitude, Latitude] for Salokhenagar, Kolhapur
    }
  });

  console.log('1. New Issue Created (Draft):');
  console.log('--------------------------------------------------');
  console.log(`Title: ${sampleReport.title}`);
  console.log(`Initial Status: ${sampleReport.status}`);
  console.log(`Reported By: ${sampleReport.reportedBy.name} (${sampleReport.reportedBy.clerkUserId})`);
  console.log(`Landmark: ${sampleReport.landmark}`);
  console.log(`Upvotes Virtual: ${sampleReport.upvoteCount}`);
  console.log(`Pre-save Status History Length: ${sampleReport.statusHistory.length}\n`);

  // 2. Simulating Status Transition by Local Admin
  console.log('2. Simulating Status Transition (Pending -> In Progress by Admin):');
  console.log('--------------------------------------------------');
  
  // Mocking save for demonstration
  sampleReport.statusHistory.push({
    status: 'Pending',
    changedByClerkId: sampleReport.reportedBy.clerkUserId,
    changedByName: sampleReport.reportedBy.name,
    comment: 'Initial issue report submitted by resident.',
    timestamp: new Date()
  });

  // Admin changes status to In Progress
  const adminInfo = {
    clerkUserId: 'user_admin_KOP_007',
    name: 'Municipal Officer Patil'
  };

  try {
    // Valid status transition
    sampleReport.status = 'In Progress';
    sampleReport.statusHistory.push({
      status: 'In Progress',
      changedByClerkId: adminInfo.clerkUserId,
      changedByName: adminInfo.name,
      comment: 'Maintenance road repair team dispatched to Salokhenagar site.',
      timestamp: new Date()
    });

    console.log(`Updated Status: ${sampleReport.status}`);
    console.log('Status History Audit Log:');
    console.dir(sampleReport.statusHistory, { depth: null });
  } catch (err) {
    console.error('Transition Error:', err.message);
  }
}

demo();
