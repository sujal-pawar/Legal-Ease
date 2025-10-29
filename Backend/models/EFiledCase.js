const mongoose = require('mongoose');

const eFiledCaseSchema = new mongoose.Schema({
  // Litigant Information
  litigant: {
    name: {
      type: String,
      required: true
    },
    mobileNumber: {
      type: String,
      required: true
    },
    aadharNumber: {
      type: String,
      required: true,
      unique: true
    },
    address: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    }
  },
  
  // Case Information
  case: {
    courtType: {
      type: String,
      required: true
    },
    caseType: {
      type: String,
      required: true
    },
    causeOfAction: {
      type: String,
      required: true
    },
    dateOfAction: {
      type: Date,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    valuation: {
      type: String,
      required: true
    },
    causeAgainstWhom: {
      type: String,
      required: true
    },
    actDetails: {
      type: String,
      required: true
    },
    sectionDetails: {
      type: String,
      required: true
    },
    relief: {
      type: String,
      required: true
    }
  },

  // Additional Fields
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'processing'],
    default: 'pending'
  },
  filingDate: {
    type: Date,
    default: Date.now
  },
  caseNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  assignedJudge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedLawyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  documents: [{
    title: String,
    fileUrl: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  timeline: [{
    action: String,
    description: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Add text index for search functionality
eFiledCaseSchema.index({ 
  'litigant.name': 'text',
  'case.subject': 'text',
  'case.caseType': 'text',
  'case.causeOfAction': 'text'
});

// Pre-save middleware to generate case number
eFiledCaseSchema.pre('save', async function(next) {
  if (!this.caseNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments();
    this.caseNumber = `EF-${year}-${(count + 1).toString().padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('EFiledCase', eFiledCaseSchema); 