const User = require('../models/User');
const Case = require('../models/Case');
const Hearing = require('../models/Hearing');

// View all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// Assign a case to a judge
exports.assignCase = async (req, res) => {
  try {
    const { caseId, judgeId } = req.body;
    if (!caseId || !judgeId) {
      return res.status(400).json({ message: 'Case ID and Judge ID required' });
    }
    const updated = await Case.findByIdAndUpdate(caseId, { 'court.judge': judgeId }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Case not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign case', error: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};

// Return stats: total users, active cases, pending hearings
exports.getMetrics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeCases = await Case.countDocuments({ status: { $in: ['active', 'pending'] } });
    const pendingHearings = await Hearing.countDocuments({ status: 'scheduled' });
    res.json({ totalUsers, activeCases, pendingHearings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch metrics', error: err.message });
  }
}; 