const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Add this line right here
app.use((req, res, next) => {
  console.log(`[DEBUG] Request received for URL: ${req.url}`);
  next();
});


// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
    database: 'Connected'
  });
});

// Routes (will be added in next sessions)
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/tasks', require('./routes/taskRoutes'));
// app.use('/api/projects', require('./routes/projectRoutes'));

// Test routes
app.use('/api/test', require('./routes/testRoutes'));

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});

//find and kill AirPlay on port 5000 with these commands
//sudo lsof -i :5000 //Run this command to find the process ID (PID) using port 5000
//kill -9 <PID>409
//kill -9 409