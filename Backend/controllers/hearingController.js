// controllers/hearingController.js

const Hearing = require('../models/Hearing');
const Notification = require('../models/Notification');
const Case = require('../models/Case');
const User = require('../models/User');

const createHearing = async (req, res) => {
  try {
    const { caseId, date, time, description } = req.body;

    const caseDoc = await Case.findById(caseId).populate('participants');
    if (!caseDoc) {
      return res.status(404).json({ message: 'Case not found' });
    }

    const hearing = new Hearing({ case: caseId, date, time, description });
    await hearing.save();

    const notifications = caseDoc.participants.map(participant => ({
      user: participant._id,
      message: `New hearing scheduled for case ${caseDoc.title} on ${date} at ${time}`,
      type: 'hearing'
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({ message: 'Hearing created and participants notified' });
  } catch (error) {
    console.error('Error creating hearing:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getHearingsByCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    const hearings = await Hearing.find({ case: caseId }).sort({ date: 1 });
    res.status(200).json(hearings);
  } catch (error) {
    console.error('Error fetching hearings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createHearing,
  getHearingsByCase
};
