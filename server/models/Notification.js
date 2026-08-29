const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Notification must have a recipient user'],
    },
    type: {
      type: String,
      enum: [
        'property_approval',
        'inquiry_received',
        'inquiry_updated',
        'visit_scheduled',
        'visit_updated',
        'agreement_created',
        'payment_recorded',
        'payment_updated',
        'maintenance_created',
        'maintenance_updated',
        'system',
      ],
      default: 'system',
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    link: {
      type: String,
      default: '',
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high-performance notification retrieval
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
