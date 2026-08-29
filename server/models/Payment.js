const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    agreement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agreement',
      required: [true, 'Payment record must reference an agreement'],
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Payment record must reference a property'],
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Payment record must specify the tenant payer'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Payment record must specify the property owner receiver'],
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [1, 'Payment amount must be greater than zero'],
    },
    paymentType: {
      type: String,
      enum: {
        values: ['Rent', 'Security Deposit', 'Other'],
        message: '{VALUE} is not a valid payment type',
      },
      default: 'Rent',
      required: true,
    },
    month: {
      type: String,
      required: [true, 'Billing month/period is required (e.g. October 2026)'],
      trim: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ['Bank Transfer', 'UPI / Net Banking', 'Credit / Debit Card', 'Cash / Cheque Record', 'Simulated Digital Payment'],
      default: 'Simulated Digital Payment',
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Paid', 'Failed'],
        message: '{VALUE} is not a valid payment status',
      },
      default: 'Paid',
    },
    transactionReference: {
      type: String,
      required: [true, 'Transaction reference code is required'],
      unique: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
paymentSchema.index({ tenant: 1, createdAt: -1 });
paymentSchema.index({ owner: 1, createdAt: -1 });
paymentSchema.index({ agreement: 1, paymentDate: -1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
