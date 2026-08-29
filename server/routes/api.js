const express = require('express');
const router = express.Router();

const healthRoutes = require('./healthRoutes');

// Health Check Route
router.use('/health', healthRoutes);

// Placeholder index for /api
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Real Estate Property Management System API',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth (Available in Phase 2)',
      properties: '/api/properties (Available in Phase 3)',
      search: '/api/properties/search (Available in Phase 4)',
      inquiries: '/api/inquiries (Available in Phase 5)',
      visits: '/api/visits (Available in Phase 5)',
      agreements: '/api/agreements (Available in Phase 6)',
      payments: '/api/payments (Available in Phase 6)',
      maintenance: '/api/maintenance (Available in Phase 7)',
      notifications: '/api/notifications (Available in Phase 7)',
      admin: '/api/admin (Available in Phase 8)',
    },
  });
});

module.exports = router;
