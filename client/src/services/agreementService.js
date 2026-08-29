import api from './api';

const agreementService = {
  // Get all agreements for current user
  getAgreements: async () => {
    const res = await api.get('/agreements');
    return res.data;
  },

  // Get single agreement details
  getAgreementById: async (id) => {
    const res = await api.get(`/agreements/${id}`);
    return res.data;
  },

  // Create new agreement (Owner/Admin)
  createAgreement: async (agreementData) => {
    const res = await api.post('/agreements', agreementData);
    return res.data;
  },

  // Update agreement details or status
  updateAgreement: async (id, updateData) => {
    const res = await api.put(`/agreements/${id}`, updateData);
    return res.data;
  },

  // Delete draft agreement
  deleteAgreement: async (id) => {
    const res = await api.delete(`/agreements/${id}`);
    return res.data;
  },
};

export default agreementService;
