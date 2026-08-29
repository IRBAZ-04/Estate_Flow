const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Favorite must be associated with a user'],
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Favorite must be associated with a property'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index ensuring a user cannot favorite the same property multiple times
favoriteSchema.index({ user: 1, property: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
