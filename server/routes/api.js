const express = require('express');
const router = express.Router();

const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const propertyRoutes = require('./propertyRoutes');

// Mount routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);

// Master API index
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Real Estate Property Management System API',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (Protected)',
        profile: 'PUT /api/auth/profile (Protected)',
      },
      properties: {
        list: 'GET /api/properties (Public)',
        my: 'GET /api/properties/my (Protected: Owner/Admin)',
        details: 'GET /api/properties/:id (Public)',
        create: 'POST /api/properties (Protected: Owner/Admin)',
        update: 'PUT /api/properties/:id (Protected: Owner/Admin)',
        delete: 'DELETE /api/properties/:id (Protected: Owner/Admin)',
        status: 'PATCH /api/properties/:id/status (Protected: Owner/Admin)',
      },
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
