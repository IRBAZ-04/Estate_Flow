const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token
 * @param {string} userId - Mongo ObjectId
 * @param {string} role - User role (admin, owner, tenant)
 * @returns {string} Signed JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'supersecretjwtkey_course_project_sem5_2026',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

module.exports = {
  generateToken,
};
