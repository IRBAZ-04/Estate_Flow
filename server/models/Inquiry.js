const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Inquiry must belong to a user (sender)'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Inquiry must belong to the property owner'],
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Inquiry must be linked to a property listing'],
    },
    name: {
      type: String,
      required: [true, 'Sender name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Sender email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Inquiry message cannot be empty'],
      maxlength: [1500, 'Message cannot exceed 1500 characters'],
      trim: true,
    },
    responseMessage: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Contacted', 'Accepted', 'Rejected', 'Closed'],
        message: '{VALUE} is not a valid inquiry status',
      },
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster user and owner queries
inquirySchema.index({ user: 1, createdAt: -1 });
inquirySchema.index({ owner: 1, createdAt: -1 });
inquirySchema.index({ property: 1 });

const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = Inquiry;
