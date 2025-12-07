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

