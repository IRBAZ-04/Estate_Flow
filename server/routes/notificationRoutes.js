const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

// All notification routes require authentication
router.use(protect);

router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', validateObjectId('id'), markAsRead);
router.delete('/:id', validateObjectId('id'), deleteNotification);

module.exports = router;
