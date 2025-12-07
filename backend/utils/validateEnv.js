/**
 * Validate required environment variables
 */
const validateEnv = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  if (process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  Warning: JWT_SECRET should be at least 32 characters long for security');
  }
};

module.exports = validateEnv;