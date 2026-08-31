const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAdminUsers,
  updateUserStatus,
  getPendingProperties,
  updatePropertyApproval,
  getPlatformOperations,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

// All Admin routes require authentication and 'admin' role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.put('/users/:id/status', validateObjectId('id'), updateUserStatus);
router.get('/properties/pending', getPendingProperties);
router.put('/properties/:id/approval', validateObjectId('id'), updatePropertyApproval);
router.get('/operations', getPlatformOperations);

module.exports = router;
