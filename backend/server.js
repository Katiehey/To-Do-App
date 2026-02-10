const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const validateEnv = require('./utils/validateEnv');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const { apiLimiter } = require('./middleware/rateLimiter');
const { initializeCronJobs } = require('./services/cronService'); // ✅ Added Cron Service Import

// Load environment variables
dotenv.config();

// Validate environment variables
validateEnv();

// Connect to MongoDB
connectDB();

// ✅ Initialize cron jobs for recurring tasks (Skip in test environment)
if (process.env.NODE_ENV !== 'test') {
  initializeCronJobs();
}

const app = express();

// --- START OF FIXED MIDDLEWARE ORDER ---

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Security Middleware
app.use(helmet()); 

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://taskmaster-pro-version.netlify.app',
      'http://localhost:5173',
      'http://localhost:4173',
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.error('CORS blocked for origin:', origin);
      return callback(new Error('CORS policy: Origin not allowed'), false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use((req, res, next) => {
  console.log('=== CORS DEBUG ===');
  console.log('Request Origin:', req.headers.origin);
  console.log('Request Method:', req.method);
  console.log('Request Headers:', req.headers);
  next();
});

app.use(mongoSanitize());
app.use(xss());
// --- END OF FIXED MIDDLEWARE ORDER ---

// Rate limiting
app.use('/api/', apiLimiter);

// Debug logger
app.use((req, res, next) => {
  console.log(`[DEBUG] Request received for URL: ${req.url}`);
  next();
});

// Custom middleware logger
app.use(logger);

// Basic route // Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'To-D0-App API is running!',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      tasks: '/api/tasks',
      projects: '/api/projects'
    } 
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'Connected',
    environment: process.env.NODE_ENV,
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/test', require('./routes/testRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));

// 404 handler
app.use('/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 10000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔒 Security middleware enabled`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;

/**
 * find and kill AirPlay on port 5000:
 * sudo lsof -i :5000
 * kill -9 <PID>
 */