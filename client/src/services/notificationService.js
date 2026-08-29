import api from './api';

const notificationService = {
  // Get notifications for logged-in user
  getNotifications: async () => {
    const res = await api.get('/notifications');
    return res.data;
  },

  // Mark single notification as read
  markAsRead: async (id) => {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const res = await api.put('/notifications/read-all');
    return res.data;
  },

  // Delete notification
  deleteNotification: async (id) => {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
  },
};

export default notificationService;
