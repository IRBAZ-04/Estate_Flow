const express = require('express');
const router = express.Router();
const {
  getPublicProperties,
  getMyProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public listing
router.get('/', getPublicProperties);

// Owner's properties (must come before /:id)
router.get('/my', protect, authorize('owner', 'admin'), getMyProperties);

// Public single property details
router.get('/:id', getPropertyById);

// Create property (Owner or Admin)
router.post(
  '/',
  protect,
  authorize('owner', 'admin'),
  upload.array('images', 5),
  createProperty
);

// Update property (Owner or Admin)
router.put(
  '/:id',
  protect,
  authorize('owner', 'admin'),
  upload.array('images', 5),
  updateProperty
);

// Delete property (Owner or Admin)
router.delete('/:id', protect, authorize('owner', 'admin'), deleteProperty);

// Update property status
router.patch(
  '/:id/status',
  protect,
  authorize('owner', 'admin'),
  updatePropertyStatus
);

module.exports = router;
