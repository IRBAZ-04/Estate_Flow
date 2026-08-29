const mongoose = require('mongoose');

const agreementSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Agreement must reference a property'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Agreement must reference the property owner'],
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Agreement must reference a tenant'],
    },
    monthlyRent: {
      type: Number,
      required: [true, 'Monthly rent amount is required'],
      min: [1, 'Monthly rent must be greater than zero'],
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Security deposit amount is required'],
      min: [0, 'Security deposit cannot be negative'],
      default: 0,
    },
    startDate: {
      type: Date,
      required: [true, 'Agreement start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'Agreement end date is required'],
    },
    terms: {
      type: String,
      default: 'Standard residential lease agreement. Rent due on the 1st of each month. 30 days notice required for termination.',
      maxlength: [3000, 'Terms cannot exceed 3000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['Draft', 'Active', 'Expired', 'Terminated'],
        message: '{VALUE} is not a valid agreement status',
      },
      default: 'Draft',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
agreementSchema.index({ owner: 1, createdAt: -1 });
agreementSchema.index({ tenant: 1, createdAt: -1 });
agreementSchema.index({ property: 1 });

const Agreement = mongoose.model('Agreement', agreementSchema);

module.exports = Agreement;
