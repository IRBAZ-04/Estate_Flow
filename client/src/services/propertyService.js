import api from './api';

const propertyService = {
  // Get public approved/available properties with query filters
  getProperties: async (params = {}) => {
    const res = await api.get('/properties', { params });
    return res.data;
  },

  // Get current owner's properties
  getMyProperties: async () => {
    const res = await api.get('/properties/my');
    return res.data;
  },

  // Get single property details by ID
  getPropertyById: async (id) => {
    const res = await api.get(`/properties/${id}`);
    return res.data;
  },

  // Create new property (supports FormData for images or JSON)
  createProperty: async (propertyData) => {
    const isFormData = propertyData instanceof FormData;
    const res = await api.post('/properties', propertyData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return res.data;
  },

  // Update existing property
  updateProperty: async (id, propertyData) => {
    const isFormData = propertyData instanceof FormData;
    const res = await api.put(`/properties/${id}`, propertyData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return res.data;
  },

  // Delete property
  deleteProperty: async (id) => {
    const res = await api.delete(`/properties/${id}`);
    return res.data;
  },

  // Update property status
  updateStatus: async (id, status) => {
    const res = await api.patch(`/properties/${id}/status`, { status });
    return res.data;
  },
};

export default propertyService;
