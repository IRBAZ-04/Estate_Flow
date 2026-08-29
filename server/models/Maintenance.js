const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Maintenance ticket must specify a property'],
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Maintenance ticket must have a requester tenant'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Maintenance ticket must belong to the property owner'],
    },
    title: {
      type: String,
      required: [true, 'Please provide an issue title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please describe the maintenance issue in detail'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      enum: {
        values: ['Plumbing', 'Electrical', 'Cleaning', 'Structural', 'Appliance', 'Other'],
        message: '{VALUE} is not a valid maintenance category',
      },
      required: [true, 'Please select a maintenance category'],
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High', 'Urgent'],
        message: '{VALUE} is not a valid priority level',
      },
      default: 'Medium',
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
        message: '{VALUE} is not a valid ticket status',
      },
      default: 'Pending',
    },
    images: {
      type: [String],
      default: [],
    },
    technicianNotes: {
      type: String,
      trim: true,
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
maintenanceSchema.index({ tenant: 1, createdAt: -1 });
maintenanceSchema.index({ owner: 1, createdAt: -1 });
maintenanceSchema.index({ property: 1, status: 1 });

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

module.exports = Maintenance;
