import api from './api';

const adminService = {
  // Get platform analytics & KPI summary
  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  // Get users directory with search and filtering
  getUsers: async (params) => {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  // Update user status (Active vs Blocked)
  updateUserStatus: async (userId, status) => {
    const res = await api.put(`/admin/users/${userId}/status`, { status });
    return res.data;
  },

  // Get pending property listings
  getPendingProperties: async () => {
    const res = await api.get('/admin/properties/pending');
    return res.data;
  },

  // Approve or Reject a property listing
  updatePropertyApproval: async (propertyId, { status, rejectionReason }) => {
    const res = await api.put(`/admin/properties/${propertyId}/approval`, {
      status,
      rejectionReason,
    });
    return res.data;
  },

  // Get centralized operations activity
  getOperations: async () => {
    const res = await api.get('/admin/operations');
    return res.data;
  },
};

export default adminService;
