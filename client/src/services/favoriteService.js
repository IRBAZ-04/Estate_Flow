import api from './api';

const favoriteService = {
  // Get all user favorites
  getFavorites: async () => {
    const res = await api.get('/favorites');
    return res.data;
  },

  // Add property to favorites
  addFavorite: async (propertyId) => {
    const res = await api.post(`/favorites/${propertyId}`);
    return res.data;
  },

  // Remove property from favorites
  removeFavorite: async (propertyId) => {
    const res = await api.delete(`/favorites/${propertyId}`);
    return res.data;
  },

  // Check if a property is favorited
  checkFavorite: async (propertyId) => {
    const res = await api.get(`/favorites/check/${propertyId}`);
    return res.data;
  },
};

export default favoriteService;
