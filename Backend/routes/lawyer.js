const express = require('express');
const router = express.Router();
const lawyerController = require('../controllers/lawyerController');
const { protect } = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.use(protect);
router.use(roleMiddleware('lawyer'));

router.post('/case', lawyerController.fileCase);
router.get('/cases', lawyerController.getLawyerCases);
router.put('/case/:id', lawyerController.updateCase);

module.exports = router;
