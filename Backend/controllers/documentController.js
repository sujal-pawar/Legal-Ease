const Document = require('../models/Document');
const multer = require('multer');
const path = require('path');

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf' && ext !== '.docx') {
      return cb(new Error('Only PDF and DOCX files are allowed'));
    }
    cb(null, true);
  }
});

exports.uploadMiddleware = upload.single('document');

// Upload document to a case
exports.uploadDocument = async (req, res) => {
  try {
    const { caseId } = req.body;
    if (!caseId || !req.file) {
      return res.status(400).json({ message: 'Case ID and document required' });
    }
    const doc = new Document({
      caseId,
      filename: req.file.originalname,
      path: req.file.path,
      uploadedBy: req.user._id,
      uploadedAt: new Date()
    });
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload document', error: err.message });
  }
};

// Fetch all documents for a case
exports.getDocumentsByCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    const docs = await Document.find({ caseId });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch documents', error: err.message });
  }
}; 