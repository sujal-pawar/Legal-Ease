const Case = require('../models/Case');
const Hearing = require('../models/Hearing');
const Document = require('../models/Document');

// View all cases the litigant is involved in
exports.getLitigantCases = async (req, res) => {
  try {
    const cases = await Case.find({ litigant: req.user._id });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cases', error: err.message });
  }
};

// View upcoming hearings
exports.getLitigantHearings = async (req, res) => {
  try {
    const hearings = await Hearing.find({ participants: req.user._id, date: { $gte: new Date() } });
    res.json(hearings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch hearings', error: err.message });
  }
};

// Download/view documents
exports.getLitigantDocuments = async (req, res) => {
  try {
    const cases = await Case.find({ litigant: req.user._id });
    const caseIds = cases.map(c => c._id);
    const documents = await Document.find({ caseId: { $in: caseIds } });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch documents', error: err.message });
  }
}; 