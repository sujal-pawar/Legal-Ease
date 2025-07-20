const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const { protect } = require('../middleware/auth');
const multer = require('multer');

// Multer setup for file uploads (if needed)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, require('path').join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// POST /api/cases - Lawyer files a new case
router.post('/', protect, upload.array('documents'), async (req, res) => {
  try {
    const {
      title, description, category, courtType, caseType, relief, causeOfAction,
      dateOfAction, subject, valuation, causeAgainstWhom, actDetails, sectionDetails,
      client, judge
    } = req.body;
    if (!title || !description || !category || !client || !judge) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Handle file uploads
    let documents = [];
    if (req.files && req.files.length > 0) {
      documents = req.files.map(f => f.filename);
    } else if (req.body.documents) {
      documents = Array.isArray(req.body.documents) ? req.body.documents : [req.body.documents];
    }
    const newCase = new Case({
      title,
      description,
      category,
      courtType,
      caseType,
      relief,
      causeOfAction,
      dateOfAction,
      subject,
      valuation,
      causeAgainstWhom,
      actDetails,
      sectionDetails,
      documents,
      lawyer: req.user._id,
      client,
      judge,
      status: 'Filed',
      filingDate: new Date()
    });
    await newCase.save();
    res.status(201).json(newCase);
  } catch (err) {
    res.status(500).json({ message: 'Failed to file case', error: err.message });
  }
});

// GET /api/cases/lawyer/:id - Get all cases filed by a lawyer
router.get('/lawyer/:id', protect, async (req, res) => {
  try {
    const cases = await Case.find({ lawyer: req.params.id })
      .populate('lawyer', 'fullName email role')
      .populate('client', 'fullName email role')
      .populate('judge', 'fullName email role');
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cases', error: err.message });
  }
});

// GET /api/cases/judge/:id - Get all cases assigned to a judge
router.get('/judge/:id', protect, async (req, res) => {
  try {
    const cases = await Case.find({ judge: req.params.id })
      .populate('lawyer', 'fullName email role')
      .populate('client', 'fullName email role')
      .populate('judge', 'fullName email role');
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cases', error: err.message });
  }
});

module.exports = router; 