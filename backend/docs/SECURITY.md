# Security Features

## Implemented Security Measures

### 1. Authentication & Authorization
- JWT token-based authentication
- Password hashing with bcrypt (salt rounds: 10)
- Token expiration (30 days)
- Protected routes middleware

### 2. Input Validation
- Email format validation
- Password strength requirements (min 6 chars, uppercase, lowercase, number)
- Name validation (letters and spaces only)
- Sanitization of user inputs

### 3. Rate Limiting
- General API: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes
- Password reset: 3 requests per hour

### 4. Security Headers (Helmet)
- X-DNS-Prefetch-Control
- X-Frame-Options
- Strict-Transport-Security
- X-Download-Options
- X-Content-Type-Options
- X-XSS-Protection

### 5. Protection Against Common Attacks
- XSS (Cross-Site Scripting) - xss-clean middleware
- NoSQL Injection - express-mongo-sanitize
- CORS - Configured for specific origin

### 6. Error Handling
- No sensitive data in error messages
- Stack traces only in development
- Generic error messages for auth failures

## Password Requirements
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## Rate Limits
| Endpoint | Limit | Window |
|----------|-------|--------|
| General API | 100 requests | 15 minutes |
| /api/auth/login | 5 requests | 15 minutes |
| /api/auth/register | 5 requests | 15 minutes |
| /api/auth/password | 3 requests | 1 hour |

## Best Practices Implemented
✅ Environment variables for secrets
✅ Input validation on all endpoints
✅ Parameterized queries (Mongoose)
✅ HTTPS enforcement in production
✅ Secure session management
✅ Error logging without sensitive data
