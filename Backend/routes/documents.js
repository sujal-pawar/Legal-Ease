const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { protect } = require('../middleware/auth');

router.post('/upload', protect, documentController.uploadMiddleware, documentController.uploadDocument);
router.get('/:caseId', protect, documentController.getDocumentsByCase);

module.exports = router; 