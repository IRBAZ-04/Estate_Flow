const express = require('express');
const router = express.Router();

const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const propertyRoutes = require('./propertyRoutes');
const favoriteRoutes = require('./favoriteRoutes');
const inquiryRoutes = require('./inquiryRoutes');
const visitRoutes = require('./visitRoutes');
const agreementRoutes = require('./agreementRoutes');
const paymentRoutes = require('./paymentRoutes');
const maintenanceRoutes = require('./maintenanceRoutes');
const notificationRoutes = require('./notificationRoutes');

// Mount routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/visits', visitRoutes);
router.use('/agreements', agreementRoutes);
router.use('/payments', paymentRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/notifications', notificationRoutes);

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
        list: 'GET /api/properties (Public Search & Filters)',
        my: 'GET /api/properties/my (Protected: Owner/Admin)',
        details: 'GET /api/properties/:id (Public)',
        create: 'POST /api/properties (Protected: Owner/Admin)',
        update: 'PUT /api/properties/:id (Protected: Owner/Admin)',
        delete: 'DELETE /api/properties/:id (Protected: Owner/Admin)',
        status: 'PATCH /api/properties/:id/status (Protected: Owner/Admin)',
      },
      favorites: {
        list: 'GET /api/favorites (Protected)',
        add: 'POST /api/favorites/:propertyId (Protected)',
        remove: 'DELETE /api/favorites/:propertyId (Protected)',
        check: 'GET /api/favorites/check/:propertyId (Protected)',
      },
      inquiries: {
        list: 'GET /api/inquiries (Protected)',
        create: 'POST /api/inquiries (Protected)',
        details: 'GET /api/inquiries/:id (Protected)',
        update: 'PUT /api/inquiries/:id (Protected)',
        delete: 'DELETE /api/inquiries/:id (Protected)',
      },
      visits: {
        list: 'GET /api/visits (Protected)',
        create: 'POST /api/visits (Protected)',
        details: 'GET /api/visits/:id (Protected)',
        update: 'PUT /api/visits/:id (Protected: Owner Accept/Reject/Reschedule)',
        cancel: 'PATCH /api/visits/:id/cancel (Protected: Requester)',
        delete: 'DELETE /api/visits/:id (Protected)',
      },
      agreements: {
        list: 'GET /api/agreements (Protected)',
        create: 'POST /api/agreements (Protected: Owner/Admin)',
        details: 'GET /api/agreements/:id (Protected)',
        update: 'PUT /api/agreements/:id (Protected: Owner/Admin)',
        delete: 'DELETE /api/agreements/:id (Protected: Owner/Admin)',
      },
      payments: {
        list: 'GET /api/payments (Protected)',
        create: 'POST /api/payments (Protected)',
        details: 'GET /api/payments/:id (Protected)',
        update: 'PUT /api/payments/:id (Protected: Owner/Admin)',
      },
      maintenance: {
        list: 'GET /api/maintenance (Protected)',
        create: 'POST /api/maintenance (Protected: Tenant/Admin)',
        details: 'GET /api/maintenance/:id (Protected)',
        update: 'PUT /api/maintenance/:id (Protected)',
      },
      notifications: {
        list: 'GET /api/notifications (Protected)',
        readAll: 'PUT /api/notifications/read-all (Protected)',
        read: 'PUT /api/notifications/:id/read (Protected)',
        delete: 'DELETE /api/notifications/:id (Protected)',
      },
      admin: '/api/admin (Available in Phase 8)',
    },
  });
});

module.exports = router;
