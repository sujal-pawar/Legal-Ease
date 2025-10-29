const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const EFiledCase = require('../models/EFiledCase');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateEFiledCase = [
  // Litigant validation
  body('litigant.name').notEmpty().withMessage('Litigant name is required'),
  body('litigant.mobileNumber').notEmpty().withMessage('Mobile number is required'),
  body('litigant.aadharNumber').notEmpty().withMessage('Aadhar number is required'),
  body('litigant.address').notEmpty().withMessage('Address is required'),
  body('litigant.state').notEmpty().withMessage('State is required'),
  body('litigant.district').notEmpty().withMessage('District is required'),
  
  // Case validation
  body('case.courtType').notEmpty().withMessage('Court type is required'),
  body('case.caseType').notEmpty().withMessage('Case type is required'),
  body('case.causeOfAction').notEmpty().withMessage('Cause of action is required'),
  body('case.dateOfAction').isISO8601().withMessage('Valid date of action is required'),
  body('case.subject').notEmpty().withMessage('Subject is required'),
  body('case.valuation').notEmpty().withMessage('Valuation is required'),
  body('case.causeAgainstWhom').notEmpty().withMessage('Cause against whom is required'),
  body('case.actDetails').notEmpty().withMessage('Act details are required'),
  body('case.sectionDetails').notEmpty().withMessage('Section details are required'),
  body('case.relief').notEmpty().withMessage('Relief sought is required')
];

// @route   POST /api/efiled-cases
// @desc    Create a new e-filed case
// @access  Private
router.post('/', protect, validateEFiledCase, async (req, res) => {
  try {
    console.log('Received e-filing request:', {
      body: req.body,
      user: req.user,
      headers: req.headers
    });

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation Error',
        errors: errors.array() 
      });
    }

    // Check if aadhar number already exists
    const existingCase = await EFiledCase.findOne({ 'litigant.aadharNumber': req.body.litigant.aadharNumber });
    if (existingCase) {
      console.log('Duplicate Aadhar number found:', req.body.litigant.aadharNumber);
      return res.status(400).json({ 
        message: 'A case with this Aadhar number already exists' 
      });
    }

    // Create new case with timeline entry
    const eFiledCase = new EFiledCase({
      litigant: req.body.litigant,
      case: req.body.case,
      timeline: [{
        action: 'Case Filed',
        description: 'New e-filing case submitted',
        performedBy: req.user._id
      }]
    });

    console.log('Created e-filed case:', eFiledCase);

    // Save the case
    const savedCase = await eFiledCase.save();
    console.log('Saved e-filed case:', savedCase);
    
    // Populate references
    const populatedCase = await EFiledCase.findById(savedCase._id)
      .populate('assignedJudge', 'fullName')
      .populate('assignedLawyer', 'fullName')
      .populate('timeline.performedBy', 'fullName');

    console.log('Populated e-filed case:', populatedCase);

    res.status(201).json({
      message: 'Case filed successfully',
      case: populatedCase
    });
  } catch (error) {
    console.error('Error creating e-filed case:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      console.log('Mongoose validation errors:', validationErrors);
      return res.status(400).json({
        message: 'Validation Error',
        errors: validationErrors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      console.log('Duplicate key error:', field);
      return res.status(400).json({
        message: 'Duplicate Error',
        errors: [{
          field: field,
          message: `A case with this ${field.split('.').pop()} already exists`
        }]
      });
    }

    // Handle other errors
    console.error('Unhandled error:', error);
    res.status(500).json({ 
      message: 'Failed to create e-filed case. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/efiled-cases
// @desc    Get all e-filed cases (with filtering)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    // Apply filters
    if (status) filter.status = status;

    // Role-based filtering
    if (req.user.role === 'judge') {
      filter.assignedJudge = req.user._id;
    } else if (req.user.role === 'lawyer') {
      filter.assignedLawyer = req.user._id;
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    const eFiledCases = await EFiledCase.find(filter)
      .populate('assignedJudge', 'fullName')
      .populate('assignedLawyer', 'fullName')
      .sort({ filingDate: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await EFiledCase.countDocuments(filter);

    res.json({
      eFiledCases,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching e-filed cases:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/efiled-cases/:id
// @desc    Get e-filed case by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const eFiledCase = await EFiledCase.findById(req.params.id)
      .populate('assignedJudge', 'fullName')
      .populate('assignedLawyer', 'fullName')
      .populate('timeline.performedBy', 'fullName');

    if (!eFiledCase) {
      return res.status(404).json({ message: 'E-filed case not found' });
    }

    res.json(eFiledCase);
  } catch (error) {
    console.error('Error fetching e-filed case:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/efiled-cases/:id
// @desc    Update e-filed case
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const eFiledCase = await EFiledCase.findById(req.params.id);
    if (!eFiledCase) {
      return res.status(404).json({ message: 'E-filed case not found' });
    }

    // Check authorization
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'judge' &&
      !eFiledCase.assignedLawyer?.equals(req.user._id)
    ) {
      return res.status(403).json({ message: 'Not authorized to update this case' });
    }

    const updateData = { ...req.body };
    
    // Add timeline entry for the update
    updateData.$push = {
      timeline: {
        action: 'Case Updated',
        description: 'Case details were modified',
        performedBy: req.user._id
      }
    };

    const updatedCase = await EFiledCase.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate('assignedJudge', 'fullName')
      .populate('assignedLawyer', 'fullName')
      .populate('timeline.performedBy', 'fullName');

    res.json(updatedCase);
  } catch (error) {
    console.error('Error updating e-filed case:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/efiled-cases/:id/documents
// @desc    Add a document to an e-filed case
// @access  Private
router.post('/:id/documents', protect, async (req, res) => {
  try {
    const { title, fileUrl } = req.body;
    const eFiledCase = await EFiledCase.findById(req.params.id);

    if (!eFiledCase) {
      return res.status(404).json({ message: 'E-filed case not found' });
    }

    eFiledCase.documents.push({
      title,
      fileUrl,
      uploadedBy: req.user._id
    });

    eFiledCase.timeline.push({
      action: 'Document Added',
      description: `New document "${title}" was added`,
      performedBy: req.user._id
    });

    await eFiledCase.save();

    res.json(eFiledCase);
  } catch (error) {
    console.error('Error adding document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/efiled-cases/:id/status
// @desc    Update e-filed case status
// @access  Private/Admin/Judge
router.put('/:id/status', protect, authorize('admin', 'judge'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected', 'processing'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const eFiledCase = await EFiledCase.findById(req.params.id);
    if (!eFiledCase) {
      return res.status(404).json({ message: 'E-filed case not found' });
    }

    eFiledCase.status = status;
    eFiledCase.timeline.push({
      action: 'Status Updated',
      description: `Case status changed to ${status}`,
      performedBy: req.user._id
    });

    await eFiledCase.save();

    res.json(eFiledCase);
  } catch (error) {
    console.error('Error updating case status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 