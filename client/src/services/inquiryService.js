import api from './api';

const inquiryService = {
  // Create a new inquiry
  createInquiry: async (inquiryData) => {
    const res = await api.post('/inquiries', inquiryData);
    return res.data;
  },

  // Get user inquiries (supports ?type=sent or ?type=received)
  getInquiries: async (params = {}) => {
    const res = await api.get('/inquiries', { params });
    return res.data;
  },

  // Get single inquiry
  getInquiryById: async (id) => {
    const res = await api.get(`/inquiries/${id}`);
    return res.data;
  },

  // Update inquiry status / response message
  updateInquiry: async (id, updateData) => {
    const res = await api.put(`/inquiries/${id}`, updateData);
    return res.data;
  },

  // Delete an inquiry
  deleteInquiry: async (id) => {
    const res = await api.delete(`/inquiries/${id}`);
    return res.data;
  },
};

export default inquiryService;
