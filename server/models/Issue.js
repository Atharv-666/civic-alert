const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an issue title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide an issue description'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: ['Pothole', 'Garbage', 'Streetlight', 'Drainage', 'Other'],
    },
    landmark: {
      type: String,
      required: [true, 'Please provide landmark/location details'],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?q=80&w=800&auto=format&fit=crop',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Issue', issueSchema);
