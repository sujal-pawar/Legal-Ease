const express = require('express');
const router = express.Router();
const { createHearing, getHearingsByCase } = require('../controllers/hearingController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createHearing);
router.get('/:caseId', protect, getHearingsByCase);

module.exports = router;
