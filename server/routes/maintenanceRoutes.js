const express = require('express');
const router = express.Router();
const {
  createMaintenance,
  getMaintenance,
  getMaintenanceById,
  updateMaintenance,
} = require('../controllers/maintenanceController');
const { protect } = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

// Validate :id param
router.param('id', validateObjectId('id'));

// All maintenance routes require authentication
router.use(protect);

router.post('/', createMaintenance);
router.get('/', getMaintenance);
router.get('/:id', getMaintenanceById);
router.put('/:id', updateMaintenance);

module.exports = router;
