const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a property title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a property description'],
      trim: true,
    },
    propertyType: {
      type: String,
      required: [true, 'Please select a property type'],
      enum: {
        values: [
          'Apartment',
          'Villa',
          'Independent House',
          'Plot/Land',
          'Commercial',
          'Office',
          'Shop',
        ],
        message: '{VALUE} is not a supported property type',
      },
    },
    purpose: {
      type: String,
      required: [true, 'Please select the purpose (Rent or Sale)'],
      enum: {
        values: ['Rent', 'Sale'],
        message: '{VALUE} is not a supported purpose',
      },
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price or monthly rent'],
      min: [0, 'Price cannot be negative'],
    },
    location: {
      type: String,
      required: [true, 'Please provide a city/area location (e.g. Adyar, Chennai)'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide the complete street address'],
      trim: true,
    },
    bedrooms: {
      type: Number,
      default: 0,
      min: [0, 'Bedrooms cannot be negative'],
    },
    bathrooms: {
      type: Number,
      default: 0,
      min: [0, 'Bathrooms cannot be negative'],
    },
    area: {
      type: Number,
      required: [true, 'Please provide the total area in sq.ft'],
      min: [1, 'Area must be at least 1 sq.ft'],
    },
    furnishingStatus: {
      type: String,
      enum: {
        values: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
        message: '{VALUE} is not a valid furnishing status',
      },
      default: 'Unfurnished',
    },
    parking: {
      type: String,
      enum: {
        values: ['Available', 'Not Available', 'Covered', 'Open'],
        message: '{VALUE} is not a valid parking status',
      },
      default: 'Available',
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Property must be associated with an owner'],
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Approved', 'Rejected', 'Available', 'Rented', 'Sold'],
        message: '{VALUE} is not a valid property status',
      },
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high-performance searching
propertySchema.index({ status: 1, location: 1, propertyType: 1, purpose: 1, price: 1 });
propertySchema.index({ owner: 1, createdAt: -1 });

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
