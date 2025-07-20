const express = require('express');
const router = express.Router();
const judgeController = require('../controllers/judgeController');
const { protect } = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.use(protect);
router.use(roleMiddleware('judge'));

router.get('/cases', judgeController.getAssignedCases);
router.post('/schedule', judgeController.scheduleHearing);
router.patch('/update-status', judgeController.updateCaseStatus);

module.exports = router; 