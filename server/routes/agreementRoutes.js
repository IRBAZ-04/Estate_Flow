const express = require('express');
const router = express.Router();
const {
  createAgreement,
  getAgreements,
  getAgreementById,
  updateAgreement,
  deleteAgreement,
} = require('../controllers/agreementController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('owner', 'admin'), createAgreement);
router.get('/', getAgreements);
router.get('/:id', getAgreementById);
router.put('/:id', authorize('owner', 'admin'), updateAgreement);
router.delete('/:id', authorize('owner', 'admin'), deleteAgreement);

module.exports = router;
