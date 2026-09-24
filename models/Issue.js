const mongoose = require('mongoose');

/**
 * Valid Status Transitions Map
 * Enforces linear lifecycle flow: Pending -> In Progress -> Resolved / Rejected
 */
const ALLOWED_STATUS_TRANSITIONS = {
  Pending: ['In Progress', 'Resolved', 'Rejected'],
  'In Progress': ['Resolved', 'Pending', 'Rejected'],
  Resolved: ['In Progress', 'Pending', 'Resolved', 'Rejected'],
  Rejected: ['Pending', 'In Progress', 'Resolved']
};

/**
 * Civic Alert - Issue Schema
 * Custom tailored for Salokhenagar, Kolhapur Community Issue Reporting
 */
const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Issue title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters long'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Issue description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    landmark: {
      type: String,
      required: [true, 'Landmark / specific location in Salokhenagar is required'],
      trim: true,
      maxlength: [150, 'Landmark details cannot exceed 150 characters'],
      example: 'Near Kalamba Water Filter Plant, Ward No. 4, Salokhenagar'
    },
    category: {
      type: String,
      enum: {
        values: [
          'Roads & Potholes',
          'Water Supply',
          'Waste Management',
          'Street Lighting',
          'Drainage & Sewage',
          'Public Safety',
          'Other'
        ],
        message: '{VALUE} is not a supported category'
      },
      default: 'Roads & Potholes',
      required: true
    },
    imageUrl: {
      type: String,
      required: [true, 'Image evidence URL from Cloudinary is required'],
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: 'imageUrl must be a valid HTTP/HTTPS URL'
      }
    },
    cloudinaryPublicId: {
      type: String,
      trim: true,
      description: 'Used for deleting or managing image assets directly in Cloudinary'
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
        message: 'Status must be Pending, In Progress, Resolved, or Rejected'
      },
      default: 'Pending',
      required: true,
      index: true
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium'
    },
    // Clerk Auth Identity details of the reporter
    reportedBy: {
      clerkUserId: {
        type: String,
        required: [true, 'Reporter Clerk User ID is required'],
        index: true
      },
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
      }
    },
    // Upvoting mechanism for community validation
    upvotedBy: [
      {
        type: String, // Clerk User IDs
        index: true
      }
    ],
    // Audit log for state transitions (Pending -> In Progress -> Resolved)
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
          required: true
        },
        changedByClerkId: {
          type: String,
          required: true
        },
        changedByName: String,
        comment: {
          type: String,
          trim: true,
          maxlength: 300
        },
        proofImageUrl: {
          type: String,
          trim: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],
    resolutionImageUrl: {
      type: String,
      trim: true,
      description: 'Resolution proof photo provided by municipal admin when closing issue'
    },
    adminNotes: {
      type: String,
      trim: true,
      maxlength: 500,
      select: true // Accessible to authority dashboard
    },
    resolvedAt: {
      type: Date,
      default: null
    },
    // Optional GeoJSON point for map views (e.g. [longitude, latitude] for Kolhapur)
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude] e.g. [74.2433, 16.6913] for Kolhapur
        validate: {
          validator: function (coords) {
            if (!coords || coords.length === 0) return true; // Optional field
            return coords.length === 2 && 
                   coords[0] >= -180 && coords[0] <= 180 && 
                   coords[1] >= -90 && coords[1] <= 90;
          },
          message: 'Coordinates must be valid [longitude, latitude]'
        }
      }
    }
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/* ==========================================================================
   INDEXES (Optimized for Community Feed & Admin Portal Queries)
   ========================================================================== */

// Composite Index: Fetch reports sorted by date filtered by status (Main Feed)
issueSchema.index({ status: 1, createdAt: -1 });

// Composite Index: Citizen dashboard query (My Reports)
issueSchema.index({ 'reportedBy.clerkUserId': 1, createdAt: -1 });

// Text Index: Keyword search across Title, Description, and Landmark
issueSchema.index(
  { title: 'text', description: 'text', landmark: 'text' },
  { weights: { title: 10, landmark: 5, description: 1 }, name: 'IssueTextIndex' }
);

// Geospatial Index: For map boundary queries in Salokhenagar/Kolhapur
issueSchema.index({ location: '2dsphere' });


/* ==========================================================================
   VIRTUALS
   ========================================================================== */

// Virtual field for total upvote count
issueSchema.virtual('upvoteCount').get(function () {
  return this.upvotedBy ? this.upvotedBy.length : 0;
});


/* ==========================================================================
   MIDDLEWARE & HOOKS
   ========================================================================== */

// Pre-save hook: Initial status history entry on creation
issueSchema.pre('save', function (next) {
  if (this.isNew) {
    this.statusHistory.push({
      status: this.status,
      changedByClerkId: this.reportedBy.clerkUserId,
      changedByName: this.reportedBy.name,
      comment: 'Initial issue report submitted by resident.',
      timestamp: new Date()
    });
  }
  next();
});


/* ==========================================================================
   INSTANCE METHODS
   ========================================================================== */

/**
 * Atomically transitions status and updates audit logs
 * @param {string} newStatus - Target status
 * @param {object} adminDetails - { clerkUserId, name }
 * @param {string} comment - Admin response comment
 */
issueSchema.methods.updateStatus = async function (newStatus, adminDetails, comment = '', proofImageUrl = null) {
  const currentStatus = this.status;

  // Validate allowed status transitions
  const allowed = ALLOWED_STATUS_TRANSITIONS[currentStatus];
  if (!allowed || !allowed.includes(newStatus)) {
    throw new Error(
      `Invalid status transition from '${currentStatus}' to '${newStatus}'. Allowed: ${allowed ? allowed.join(', ') : 'None'}`
    );
  }

  this.status = newStatus;
  
  if (proofImageUrl) {
    this.resolutionImageUrl = proofImageUrl;
  }

  if (newStatus === 'Resolved') {
    this.resolvedAt = new Date();
  } else if (currentStatus === 'Resolved' && newStatus !== 'Resolved') {
    this.resolvedAt = null;
  }

  this.statusHistory.push({
    status: newStatus,
    changedByClerkId: adminDetails.clerkUserId,
    changedByName: adminDetails.name,
    comment: comment || `Status updated to ${newStatus}`,
    proofImageUrl: proofImageUrl || this.resolutionImageUrl,
    timestamp: new Date()
  });

  return await this.save();
};

/**
 * Toggles community upvote for a resident
 * @param {string} clerkUserId 
 */
issueSchema.methods.toggleUpvote = async function (clerkUserId) {
  const index = this.upvotedBy.indexOf(clerkUserId);
  if (index === -1) {
    this.upvotedBy.push(clerkUserId);
  } else {
    this.upvotedBy.splice(index, 1);
  }
  return await this.save();
};


/* ==========================================================================
   STATIC HELPER METHODS
   ========================================================================== */

/**
 * Aggregates analytical stats for the Admin Dashboard in Kolhapur Municipal Division
 */
issueSchema.statics.getDashboardStats = async function () {
  return await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        status: '$_id',
        count: 1
      }
    }
  ]);
};

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
