import api from './api';

const maintenanceService = {
  // Get all maintenance tickets for current user
  getMaintenance: async () => {
    const res = await api.get('/maintenance');
    return res.data;
  },

  // Get single maintenance ticket details
  getMaintenanceById: async (id) => {
    const res = await api.get(`/maintenance/${id}`);
    return res.data;
  },

  // Create maintenance ticket (Tenant/Admin)
  createMaintenance: async (ticketData) => {
    const res = await api.post('/maintenance', ticketData);
    return res.data;
  },

  // Update maintenance ticket status/technician notes
  updateMaintenance: async (id, updateData) => {
    const res = await api.put(`/maintenance/${id}`, updateData);
    return res.data;
  },
};

export default maintenanceService;
