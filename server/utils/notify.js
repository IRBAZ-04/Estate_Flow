const Notification = require('../models/Notification');

/**
 * Helper to create and persist an in-app notification safely
 * @param {Object} params
 * @param {string|mongoose.Types.ObjectId} params.recipient
 * @param {string} params.type
 * @param {string} params.title
 * @param {string} params.message
 * @param {string|mongoose.Types.ObjectId} [params.relatedId]
 * @param {string} [params.link]
 */
const notify = async ({ recipient, type, title, message, relatedId, link }) => {
  try {
    if (!recipient || !title || !message) return null;
    const notification = await Notification.create({
      recipient,
      type: type || 'system',
      title,
      message,
      relatedId: relatedId || undefined,
      link: link || '',
      read: false,
    });
    return notification;
  } catch (error) {
    console.error('[Notification Helper Error]:', error.message);
    return null;
  }
};

module.exports = notify;
