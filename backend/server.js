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


// Load environment variables
dotenv.config();

// Validate environment variables
validateEnv();

// Connect to MongoDB
connectDB();

const app = express();

// --- START OF FIXED MIDDLEWARE ORDER ---

// Body parser (MUST come before mongoSanitize, helmet, and xss-clean if they access req.body)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Security Middleware
app.use(helmet()); // Set security headers
// // CORS needs to be defined early too
app.use(cors({  
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(mongoSanitize()); // Prevent MongoDB injection
app.use(xss()); // Prevent XSS attacks
// --- END OF FIXED MIDDLEWARE ORDER ---

// Rate limiting
app.use('/api/', apiLimiter); // Apply to all API routes

// Add this line right here
app.use((req, res, next) => {
  console.log(`[DEBUG] Request received for URL: ${req.url}`);
  next();
});

// Custom middleware logger
app.use(logger);

// Basic route // Test route
app.get('/', (req, res) => {
  res.json({ message: 'To-D0-App API is running!',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      tasks: '/api/tasks',
      projects: '/api/projects'} });
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

// Routes (will be added in next sessions)
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/tasks', require('./routes/taskRoutes'));
// app.use('/api/projects', require('./routes/projectRoutes'));
// Test routes
app.use('/api/test', require('./routes/testRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// 404 handler
app.use('/*splat', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔒 Security middleware enabled`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;

//find and kill AirPlay on port 5000 with these commands
//sudo lsof -i :5000 //Run this command to find the process ID (PID) using port 5000
//kill -9 <PID>409
//kill -9 409