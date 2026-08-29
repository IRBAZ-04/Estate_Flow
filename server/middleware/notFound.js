/**
 * 404 Not Found Middleware for undefined API routes
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = notFound;
