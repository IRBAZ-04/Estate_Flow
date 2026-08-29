const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Visit request must specify a property'],
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Visit request must have a requester user'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Visit request must belong to the property owner'],
    },
    date: {
      type: Date,
      required: [true, 'Visit appointment date is required'],
    },
    time: {
      type: String,
      required: [true, 'Visit appointment time slot is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Confirmed', 'Rejected', 'Rescheduled', 'Completed', 'Cancelled'],
        message: '{VALUE} is not a valid visit status',
      },
      default: 'Pending',
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      trim: true,
    },
    ownerFeedback: {
      type: String,
      maxlength: [500, 'Owner feedback cannot exceed 500 characters'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
visitSchema.index({ requester: 1, createdAt: -1 });
visitSchema.index({ owner: 1, createdAt: -1 });
visitSchema.index({ property: 1, date: 1 });

const Visit = mongoose.model('Visit', visitSchema);

module.exports = Visit;
