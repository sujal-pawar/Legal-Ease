const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  courtType: String,
  caseType: String,
  relief: String,
  causeOfAction: String,
  dateOfAction: Date,
  subject: String,
  valuation: String,
  causeAgainstWhom: String,
  actDetails: String,
  sectionDetails: String,
  documents: [String],
  lawyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  judge: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'Filed' },
  filingDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Case', caseSchema); 