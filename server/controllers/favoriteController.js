const Favorite = require('../models/Favorite');
const Property = require('../models/Property');

/**
 * @desc    Add a property to user favorites
 * @route   POST /api/favorites/:propertyId
 * @access  Private
 */
const addFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found',
      });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
      property: propertyId,
    });

    if (existingFavorite) {
      return res.status(200).json({
        success: true,
        message: 'Property is already in your favorites',
        data: existingFavorite,
      });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      property: propertyId,
    });

    return res.status(201).json({
      success: true,
      message: 'Property added to favorites',
      data: favorite,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove a property from user favorites
 * @route   DELETE /api/favorites/:propertyId
 * @access  Private
 */
const removeFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      property: propertyId,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Property was not found in your favorites',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Property removed from favorites',
      data: { propertyId },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all favorites of the current logged-in user
 * @route   GET /api/favorites
 * @access  Private
 */
const getUserFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate({
        path: 'property',
        populate: {
          path: 'owner',
          select: 'name email phone profileImage',
        },
      })
      .sort({ createdAt: -1 });

    // Filter out any favorites where the underlying property was deleted
    const validFavorites = favorites.filter((f) => f.property !== null);

    return res.status(200).json({
      success: true,
      count: validFavorites.length,
      data: validFavorites,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check if a specific property is favorited by current user
 * @route   GET /api/favorites/check/:propertyId
 * @access  Private
 */
const checkFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const favorite = await Favorite.findOne({
      user: req.user._id,
      property: propertyId,
    });

    return res.status(200).json({
      success: true,
      isFavorite: !!favorite,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  checkFavorite,
};
