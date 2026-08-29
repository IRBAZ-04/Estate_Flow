const express = require('express');
const router = express.Router();
const {
  createVisit,
  getVisits,
  getVisitById,
  updateVisitStatus,
  cancelVisit,
  deleteVisit,
} = require('../controllers/visitController');
const { protect } = require('../middleware/auth');

// All visit routes require authentication
router.use(protect);

router.post('/', createVisit);
router.get('/', getVisits);
router.get('/:id', getVisitById);
router.put('/:id', updateVisitStatus);
router.patch('/:id/cancel', cancelVisit);
router.delete('/:id', deleteVisit);

module.exports = router;
