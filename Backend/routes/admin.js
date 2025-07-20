const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.use(protect);
router.use(roleMiddleware('admin'));

router.get('/users', adminController.getAllUsers);
router.patch('/assign-case', adminController.assignCase);
router.delete('/user/:id', adminController.deleteUser);
router.get('/metrics', adminController.getMetrics);

module.exports = router; 