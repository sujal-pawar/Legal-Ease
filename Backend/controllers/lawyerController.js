const Case = require('../models/Case');
const Document = require('../models/Document');

// File a new case
exports.fileCase = async (req, res) => {
  try {
    const { title, description, litigantId, documents } = req.body;
    if (!title || !description || !litigantId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const newCase = new Case({
      title,
      description,
      status: 'pending',
      lawyer: req.user._id,
      litigant: litigantId,
      documents: documents || [],
      createdAt: new Date()
    });
    await newCase.save();
    res.status(201).json(newCase);
  } catch (err) {
    res.status(500).json({ message: 'Failed to file case', error: err.message });
  }
};

// View all cases filed by the logged-in lawyer
exports.getLawyerCases = async (req, res) => {
  try {
    const cases = await Case.find({ lawyer: req.user._id });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cases', error: err.message });
  }
};

// Update case info or upload new documents
exports.updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const updatedCase = await Case.findByIdAndUpdate(id, update, { new: true });
    if (!updatedCase) return res.status(404).json({ message: 'Case not found' });
    res.json(updatedCase);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update case', error: err.message });
  }
}; 