const express = require('express');
const router = express.Router();
const {
  createPayment,
  getPayments,
  getPaymentById,
  updatePaymentStatus,
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', createPayment);
router.get('/', getPayments);
router.get('/:id', getPaymentById);
router.put('/:id', authorize('owner', 'admin'), updatePaymentStatus);

module.exports = router;
