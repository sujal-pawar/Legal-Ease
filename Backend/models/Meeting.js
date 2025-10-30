const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  caseNumber: {
    type: String,
    required: true
  },
  scheduledAt: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: false,
    default: 'As needed'
  },
  participants: {
    judge: {
      type: String,
      required: true
    },
    lawyers: [{
      type: String,
      required: true
    }],
    litigants: [{
      type: String,
      required: true
    }]
  },
  meetingLink: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  recordings: [{
    url: String,
    createdAt: Date
  }],
  notes: [{
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Add text index for search functionality
meetingSchema.index({ 
  title: 'text', 
  caseNumber: 'text',
  'participants.judge': 'text'
});

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;
