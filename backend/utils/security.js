/**
 * Sanitize user input to prevent XSS
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
};

/**
 * Check password strength
 */
const isStrongPassword = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber,
    length: password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
  };
};

/**
 * Generate random string
 */
const generateRandomString = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Mask email for privacy
 * Example: john.doe@example.com -> j***e@e***e.com
 */
const maskEmail = (email) => {
  if (!email) return '';
  
  const [username, domain] = email.split('@');
  const [domainName, tld] = domain.split('.');
  
  const maskedUsername = username.charAt(0) + '***' + username.charAt(username.length - 1);
  const maskedDomain = domainName.charAt(0) + '***' + domainName.charAt(domainName.length - 1);
  
  return `${maskedUsername}@${maskedDomain}.${tld}`;
};

module.exports = {
  sanitizeInput,
  isStrongPassword,
  generateRandomString,
  maskEmail,
};