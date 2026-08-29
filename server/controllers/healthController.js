const mongoose = require('mongoose');

/**
 * @desc    Get API & Database health status
 * @route   GET /api/health
 * @access  Public
 */
const getHealthStatus = (req, res) => {
  const dbStateMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  const dbStateCode = mongoose.connection.readyState;
  const dbStatus = dbStateMap[dbStateCode] || 'Unknown';

  const healthData = {
    status: 'online',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    serverPort: process.env.PORT || 5000,
    database: {
      status: dbStatus,
      code: dbStateCode,
      name: mongoose.connection.name || 'N/A',
      host: mongoose.connection.host || 'N/A',
    },
    version: '1.0.0',
    phase: 'Phase 1: Project Setup & Architecture Scaffolding',
  };

  return res.status(200).json({
    success: true,
    message: 'Real Estate Management API is healthy',
    data: healthData,
  });
};

module.exports = {
  getHealthStatus,
};
