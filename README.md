# To-Do-App

# 🚀 To-Do-App

A modern, industry-standard to-do list application built with the MERN stack.

## Features
- ✅ Task Management (CRUD operations)
- 🏷️ Tags & Priority Levels
- 📁 Projects & Categories
- 🔔 Reminders & Notifications
- 🔄 Recurring Tasks
- 🔍 Search & Advanced Filtering
- 📱 Responsive Design
- 🌙 Dark Mode
- 🔐 Secure Authentication
- 📡 Offline Functionality

## Tech Stack

**Frontend:**
- React 18 + Vite
- TailwindCSS
- React Router
- Axios

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt

**Deployment:**
- Frontend: Vercel/Netlify
- Backend: Render/Railway
- Database: MongoDB Atlas

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Katiehey/To-Do-App
cd To-Do-App
```

2. Setup Backend:
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret
npm run dev
```

3. Setup Frontend:
```bash
cd ../frontend
npm install
cp .env.example .env
# Update .env with your API URL
npm run dev
```

### Environment Variables

**Backend (.env):**
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `NODE_ENV` - Environment (development/production)

**Frontend (.env):**
- `VITE_API_URL` - Backend API URL

## Project Structure

```
taskmaster-pro/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── context/    # React context
│   │   ├── hooks/      # Custom hooks
│   │   └── utils/      # Utility functions
│   └── package.json
├── backend/            # Express backend
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── config/         # Configuration files
│   └── server.js       # Entry point
└── README.md
```

## Contributing
Pull requests are welcome! For major changes, please open an issue first.

## License
MIT

---
Built with ❤️ using the MERN stack
```

### 6. First Commit & Push (3 mins)
```bash
# From project root
git add .
git commit -m "Initial project setup: React frontend + Express backend structure"
git push origin main
```

## ✅ Session 4 Complete!

### What was accomplished:
✓ User model with password hashing
✓ Task model with all fields (recurring, subtasks, attachments)
✓ Project model with color & icon
✓ Database indexes for performance
✓ Model validation and middleware
✓ Test script for models
✓ Database seeder (optional)

### Models include:

**User Model:**
- Authentication fields
- User preferences (theme, notifications)
- Password hashing middleware
- Public profile method

**Task Model:**
- All required fields (title, description, priority, etc.)
- Recurring task support
- Subtasks array
- Tags and attachments
- Collaboration (sharedWith)
- Custom methods (markCompleted, markIncomplete)
- Virtual field (isOverdue)

**Project Model:**
- Project organization
- Color coding
- Task counts
- Archive functionality

### Database Indexes Created:
- User: email (unique)
- Task: user + completed, user + project, user + dueDate, user + priority
- Project: user + isArchived, user + name


## ✅ Session 5 Complete!

### What was accomplished:
✓ JWT token generation utility
✓ Environment validation
✓ Auth controllers (register, login, getMe, updateProfile, updatePassword)
✓ Auth routes (public & protected)
✓ Auth middleware (protect, optionalAuth)
✓ Password hashing (pre-save middleware)
✓ Token verification
✓ Protected routes
✓ Comprehensive testing

### Auth system now includes:

**Endpoints:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `PUT /api/auth/password` - Change password (protected)

**Security Features:**
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Token expiration (30 days)
- ✅ Protected routes middleware
- ✅ User active status check
- ✅ Password strength validation
- ✅ Email uniqueness

**Response Format:**
```json
{
  "success": true/false,
  "message": "...",
  "data": { ... }
}
```

---

### Backend API Structure So Far:
```
GET  /                      → API info
GET  /api/health           → Health check
GET  /api/test/ping        → Test endpoint

POST /api/auth/register    → Register user
POST /api/auth/login       → Login user
GET  /api/auth/me          → Get current user (🔒)
PUT  /api/auth/profile     → Update profile (🔒)
PUT  /api/auth/password    → Change password (🔒)


## ✅ Session 6 Complete!

### What was accomplished:
✓ Input validation with express-validator
✓ Rate limiting (API, auth, password reset)
✓ Security headers with helmet
✓ XSS protection
✓ NoSQL injection prevention
✓ Improved error handling
✓ Security utility functions
✓ Comprehensive testing
✓ Security documentation

### Security Layers Added:

**1. Input Validation:**
- Email format
- Password strength (6+ chars, uppercase, lowercase, number)
- Name validation (letters only)
- Field length limits

**2. Rate Limiting:**
- General API: 100 req/15min
- Auth: 5 req/15min
- Password reset: 3 req/hour

**3. Security Headers:**
- Helmet middleware (13+ security headers)
- XSS protection
- NoSQL injection prevention
- CORS configuration

**4. Error Handling:**
- Friendly error messages
- No sensitive data exposure
- Proper HTTP status codes
- Mongoose error handling

### Backend is now production-ready with:
🔒 Strong authentication
🛡️ Input validation
⏱️ Rate limiting
🔐 Security headers
🚫 XSS/Injection protection
📝 Comprehensive error handling
