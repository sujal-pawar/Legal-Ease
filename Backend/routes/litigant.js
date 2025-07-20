const express = require('express');
const router = express.Router();
const litigantController = require('../controllers/litigantController');
const { protect } = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.use(protect);
router.use(roleMiddleware('litigant'));

router.get('/cases', litigantController.getLitigantCases);
router.get('/hearings', litigantController.getLitigantHearings);
router.get('/documents', litigantController.getLitigantDocuments);

module.exports = router; 