const mongoose = require('mongoose');

/**
 * Middleware to validate MongoDB ObjectId in request parameters
 * @param {string} paramName - Name of the route parameter to validate (defaults to 'id')
 */
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format: '${id}'. Must be a 24-character hexadecimal string`,
      });
    }
    next();
  };
};

module.exports = validateObjectId;
