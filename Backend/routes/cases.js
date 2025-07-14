const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Case = require('../models/Case');
const multer = require('multer');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// @route   POST /api/cases
// @desc    Create a new case
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      court,
      parties,
      priority
    } = req.body;

    // Generate case number (you might want to implement a more sophisticated system)
    const caseNumber = `CASE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newCase = new Case({
      title,
      caseNumber,
      description,
      type,
      court,
      parties,
      priority,
      timeline: [{
        action: 'Case Created',
        description: 'New case file opened',
        performedBy: req.user._id
      }]
    });

    const savedCase = await newCase.save();
    
    // Populate relevant fields
    await savedCase
      .populate('court.judge', 'fullName')
      .populate('parties.plaintiffs', 'fullName')
      .populate('parties.defendants', 'fullName')
      .populate('parties.lawyers', 'fullName')
      .execPopulate();

    res.status(201).json(savedCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/cases
// @desc    Get all cases (with filtering)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const {
      status,
      type,
      priority,
      search,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};
    
    // Apply filters
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;

    // Role-based filtering
    if (req.user.role === 'judge') {
      filter['court.judge'] = req.user._id;
    } else if (req.user.role === 'lawyer') {
      filter['parties.lawyers'] = req.user._id;
    } else if (req.user.role === 'litigant') {
      filter.$or = [
        { 'parties.plaintiffs': req.user._id },
        { 'parties.defendants': req.user._id }
      ];
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    const cases = await Case.find(filter)
      .populate('court.judge', 'fullName')
      .populate('parties.plaintiffs', 'fullName')
      .populate('parties.defendants', 'fullName')
      .populate('parties.lawyers', 'fullName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Case.countDocuments(filter);

    res.json({
      cases,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/cases/:id
// @desc    Get case by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const case_ = await Case.findById(req.params.id)
      .populate('court.judge', 'fullName')
      .populate('parties.plaintiffs', 'fullName')
      .populate('parties.defendants', 'fullName')
      .populate('parties.lawyers', 'fullName')
      .populate('timeline.performedBy', 'fullName');

    if (!case_) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.json(case_);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/cases/:id
// @desc    Update case
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const case_ = await Case.findById(req.params.id);
    if (!case_) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // Check authorization
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'judge' &&
      !case_.parties.lawyers.includes(req.user._id)
    ) {
      return res.status(403).json({ message: 'Not authorized to update this case' });
    }

    const {
      title,
      description,
      status,
      type,
      priority,
      court,
      parties
    } = req.body;

    const updateData = {
      title,
      description,
      status,
      type,
      priority,
      court,
      parties
    };

    // Add timeline entry for the update
    updateData.$push = {
      timeline: {
        action: 'Case Updated',
        description: 'Case details were modified',
        performedBy: req.user._id
      }
    };

    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate('court.judge', 'fullName')
      .populate('parties.plaintiffs', 'fullName')
      .populate('parties.defendants', 'fullName')
      .populate('parties.lawyers', 'fullName')
      .populate('timeline.performedBy', 'fullName');

    res.json(updatedCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/cases/:id/hearings
// @desc    Add a hearing to a case
// @access  Private
router.post('/:id/hearings', protect, authorize('judge', 'admin'), async (req, res) => {
  try {
    const { date, type, notes } = req.body;

    const case_ = await Case.findById(req.params.id);
    if (!case_) {
      return res.status(404).json({ message: 'Case not found' });
    }

    case_.hearings.push({ date, type, notes });
    case_.timeline.push({
      action: 'Hearing Scheduled',
      description: `New hearing scheduled for ${new Date(date).toLocaleDateString()}`,
      performedBy: req.user._id
    });

    await case_.save();

    res.json(case_);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/cases/:id/documents
// @desc    Add a document to a case
// @access  Private
router.post('/:id/documents', protect, async (req, res) => {
  try {
    const { title, fileUrl } = req.body;

    const case_ = await Case.findById(req.params.id);
    if (!case_) {
      return res.status(404).json({ message: 'Case not found' });
    }

    case_.documents.push({
      title,
      fileUrl,
      uploadedBy: req.user._id
    });

    case_.timeline.push({
      action: 'Document Added',
      description: `New document "${title}" was added`,
      performedBy: req.user._id
    });

    await case_.save();

    res.json(case_);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/cases/{id}/upload:
 *   post:
 *     summary: Upload a document to a case
 *     tags: [Cases]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Case ID
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded and added to case documents
 *       404:
 *         description: Case not found
 *       500:
 *         description: Server error
 */
router.post('/:id/upload', protect, upload.single('file'), async (req, res) => {
  try {
    const case_ = await Case.findById(req.params.id);
    if (!case_) {
      return res.status(404).json({ message: 'Case not found' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    case_.documents.push({
      title: req.file.originalname,
      fileUrl,
      uploadedBy: req.user._id
    });
    case_.timeline.push({
      action: 'Document Uploaded',
      description: `File "${req.file.originalname}" uploaded`,
      performedBy: req.user._id
    });
    await case_.save();
    res.json({ message: 'File uploaded', fileUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 