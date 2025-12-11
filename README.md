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


## ✅ Session 7 Complete!

### What was accomplished:
✓ AuthContext with state management
✓ Beautiful Login component
✓ Register component with password strength
✓ Protected routes
✓ Token management (localStorage)
✓ Auth-aware Navbar
✓ Error handling UI
✓ Loading states
✓ Automatic token injection
✓ Redirect on unauthorized

### Your auth flow now:

**Registration Flow:**
1. User fills form → validation
2. Password strength indicator
3. Submit → API call
4. Token saved → user logged in
5. Redirect to /tasks

**Login Flow:**
1. User enters credentials
2. Submit → API call
3. Token saved → user logged in
4. Redirect to /tasks

**Protected Routes:**
- Check if user exists
- Show loading while checking
- Redirect to login if not authenticated

**Token Management:**
- Stored in localStorage
- Auto-injected in API requests (axios interceptor)
- Cleared on logout or 401 errors

---

### UI Features:

** Login/Register Pages:**
- 📧 Email & password fields with icons
- 🔒 Password strength indicator (register)
- ⚠️ Error alerts
- ⏳ Loading states
- 🔗 Navigation links

**Navbar:**
- Shows user name when logged in
- Logout button
- Conditional rendering (logged in/out)
- Responsive mobile menu

**Protected Route:**
- Loading spinner while checking auth
- Auto-redirect if not authenticated

---

### Frontend Structure Now:
```
frontend/src/
├── components/
│   ├── auth/
│   │   ├── Login.jsx           ✅ Login form
│   │   └── Register.jsx        ✅ Register form
│   ├── common/
│   │   └── ProtectedRoute.jsx  ✅ Route guard
│   └── layout/
│       └── Navbar.jsx          ✅ Auth-aware nav
├── context/
│   └── AuthContext.jsx         ✅ Auth state
├── pages/
│   ├── Tasks.jsx               ✅ Protected page
│   └── ...
├── services/
│   └── api.js                  ✅ With interceptors
└── App.jsx                     ✅ With protected routes


## ✅ Session 8 Complete!

### What was accomplished:
✓ Task validation middleware
✓ Complete CRUD operations
✓ Advanced filtering (priority, status, completed, project, tags)
✓ Search functionality (title & description)
✓ Pagination support
✓ Sorting options
✓ Toggle completion endpoint
✓ Task statistics
✓ Project task count updates

### Task API Endpoints:

```
GET    /api/tasks              → Get all tasks (with filters)
POST   /api/tasks              → Create new task
GET    /api/tasks/stats        → Get task statistics
GET    /api/tasks/:id          → Get single task
PUT    /api/tasks/:id          → Update task
DELETE /api/tasks/:id          → Delete task
PATCH  /api/tasks/:id/toggle   → Toggle completion
```

### Query Parameters for GET /api/tasks:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `completed` - Filter by completion (true/false)
- `priority` - Filter by priority (low/medium/high)
- `status` - Filter by status (pending/in-progress/completed/archived)
- `project` - Filter by project ID
- `tags` - Filter by tags (can be array)
- `search` - Search in title and description
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort order (asc/desc, default: desc)

### Features Implemented:

**CRUD Operations:**
- ✅ Create task with validation
- ✅ Get all tasks with filters
- ✅ Get single task
- ✅ Update task
- ✅ Delete task
- ✅ Toggle completion

**Advanced Features:**
- ✅ Search in title/description
- ✅ Filter by multiple criteria
- ✅ Pagination with total count
- ✅ Custom sorting
- ✅ Task statistics aggregation
- ✅ Project task count sync
- ✅ Authorization checks

**Validation:**
- ✅ Title (1-200 chars, required)
- ✅ Description (max 2000 chars)
- ✅ Priority enum validation
- ✅ Status enum validation
- ✅ Date format validation
- ✅ Tags array validation
- ✅ Project ID validation


## ✅ Session 9 Complete!

### What was accomplished:
✓ Complete task API service
✓ Task context with state management
✓ Custom hooks (useTasks, useTaskStats)
✓ Task statistics component
✓ Context integration in App
✓ Error handling
✓ API testing

### Task Service Functions:
```javascript
taskService.getTasks(filters)      // Get all tasks
taskService.getTaskById(id)        // Get single task
taskService.createTask(data)       // Create task
taskService.updateTask(id, data)   // Update task
taskService.deleteTask(id)         // Delete task
taskService.toggleTask(id)         // Toggle completion
taskService.getStats()             // Get statistics
```

### Task Context Functions:
```javascript
const {
  tasks,              // Array of tasks
  loading,            // Loading state
  error,              // Error message
  filters,            // Current filters
  pagination,         // Pagination info
  fetchTasks,         // Fetch tasks
  createTask,         // Create task
  updateTask,         // Update task
  deleteTask,         // Delete task
  toggleTask,         // Toggle completion
  updateFilters,      // Update filters
  clearFilters,       // Clear filters
} = useTask();
```

### Statistics Display:
- ✅ Total tasks count
- ✅ Completed tasks count
- ✅ Pending tasks count
- ✅ Completion rate percentage
- ✅ Beautiful card design
- ✅ Icons and colors

### State Management:
- ✅ Global task state (TaskContext)
- ✅ Optimistic UI updates
- ✅ Error handling
- ✅ Loading states
- ✅ Filter management
- ✅ Pagination tracking


## ✅ Session 10 Complete!

### What we accomplished:
✓ TaskItem component (task card with actions)
✓ AddTaskModal component (create/edit form)
✓ TaskList component (list with empty state)
✓ Full CRUD integration
✓ Beautiful UI with Tailwind
✓ Animations and transitions
✓ Error handling
✓ Loading states

### Components Created:

**TaskItem:**
- ✅ Checkbox for completion
- ✅ Title and description
- ✅ Priority badge with colors
- ✅ Due date with overdue indicator
- ✅ Tags display
- ✅ Project indicator
- ✅ Edit and delete buttons
- ✅ Hover effects

**AddTaskModal:**
- ✅ Create/Edit mode
- ✅ Title input (required)
- ✅ Description textarea
- ✅ Priority selector
- ✅ Due date picker
- ✅ Tags input (comma separated)
- ✅ Form validation
- ✅ Error alerts
- ✅ Loading states

**TaskList:**
- ✅ Task mapping
- ✅ Loading spinner
- ✅ Empty state
- ✅ Beautiful layout

### User Experience:
- ✅ Click "Add Task" → Modal opens
- ✅ Fill form → Task created instantly
- ✅ Click checkbox → Toggle completion
- ✅ Click edit → Modal opens with data
- ✅ Click delete → Confirmation dialog
- ✅ Stats update automatically
- ✅ Smooth animations
