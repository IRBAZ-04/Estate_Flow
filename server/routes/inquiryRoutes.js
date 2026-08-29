const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
} = require('../controllers/inquiryController');
const { protect } = require('../middleware/auth');

// All inquiry routes require authentication
router.use(protect);

router.post('/', createInquiry);
router.get('/', getInquiries);
router.get('/:id', getInquiryById);
router.put('/:id', updateInquiryStatus);
router.delete('/:id', deleteInquiry);

module.exports = router;
