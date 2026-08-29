import api from './api';

const visitService = {
  // Schedule a visit
  createVisit: async (visitData) => {
    const res = await api.post('/visits', visitData);
    return res.data;
  },

  // Get visits (supports ?type=sent or ?type=received)
  getVisits: async (params = {}) => {
    const res = await api.get('/visits', { params });
    return res.data;
  },

  // Get single visit details
  getVisitById: async (id) => {
    const res = await api.get(`/visits/${id}`);
    return res.data;
  },

  // Update visit (Owner confirm, reject, reschedule)
  updateVisit: async (id, updateData) => {
    const res = await api.put(`/visits/${id}`, updateData);
    return res.data;
  },

  // Cancel visit (Requester)
  cancelVisit: async (id) => {
    const res = await api.patch(`/visits/${id}/cancel`);
    return res.data;
  },

  // Delete visit
  deleteVisit: async (id) => {
    const res = await api.delete(`/visits/${id}`);
    return res.data;
  },
};

export default visitService;
