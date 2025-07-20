const Case = require('../models/Case');
const Hearing = require('../models/Hearing');

// Get all cases assigned to this judge
exports.getAssignedCases = async (req, res) => {
  try {
    const cases = await Case.find({ 'court.judge': req.user._id });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cases', error: err.message });
  }
};

// Schedule a hearing
exports.scheduleHearing = async (req, res) => {
  try {
    const { caseId, date, time } = req.body;
    if (!caseId || !date || !time) {
      return res.status(400).json({ message: 'All fields required' });
    }
    const hearing = new Hearing({ caseId, date, time, participants: [req.user._id], status: 'scheduled' });
    await hearing.save();
    res.status(201).json(hearing);
  } catch (err) {
    res.status(500).json({ message: 'Failed to schedule hearing', error: err.message });
  }
};

// Update status of a case
exports.updateCaseStatus = async (req, res) => {
  try {
    const { caseId, status } = req.body;
    if (!caseId || !status) {
      return res.status(400).json({ message: 'Case ID and status required' });
    }
    const updated = await Case.findByIdAndUpdate(caseId, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Case not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update case status', error: err.message });
  }
}; 