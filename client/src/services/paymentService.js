import api from './api';

const paymentService = {
  // Get all payment records and financial overview
  getPayments: async () => {
    const res = await api.get('/payments');
    return res.data;
  },

  // Get single payment receipt
  getPaymentById: async (id) => {
    const res = await api.get(`/payments/${id}`);
    return res.data;
  },

  // Record a payment transaction
  createPayment: async (paymentData) => {
    const res = await api.post('/payments', paymentData);
    return res.data;
  },

  // Update payment status (Owner/Admin)
  updatePaymentStatus: async (id, updateData) => {
    const res = await api.put(`/payments/${id}`, updateData);
    return res.data;
  },
};

export default paymentService;
