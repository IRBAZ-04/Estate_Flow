const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const seedAdminUser = require('./utils/seedAdmin');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const { helmetMiddleware, authLimiter, apiLimiter } = require('./middleware/security');

// Initialize database connection & admin seeder
connectDB().then(() => {
  seedAdminUser();
});

const app = express();

// 1. Security Headers (Helmet)
app.use(helmetMiddleware);

// 2. Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 3. CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// 4. Body parser with strict size limits to prevent Denial of Service
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Rate Limiting Middleware
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api', apiLimiter);

// 6. Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 7. Mount API Routes
app.use('/api', apiRoutes);

// 8. Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Real Estate Property Management System API',
    status: 'Running',
    docs: '/api',
    health: '/api/health',
  });
});

// 9. 404 and Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection] ${err.message}`);
});

module.exports = { app, server };
