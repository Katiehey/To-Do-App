import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Tasks from './pages/Tasks';
import NotFound from './pages/NotFound';
import 'react-datepicker/dist/react-datepicker.css';
// Assuming you will create these components soon:
// import Tasks from './pages/Tasks';
// import Projects from './pages/Projects';
// import Calendar from './pages/Calendar';


function App() {
  return (
    // 1. BrowserRouter must wrap all routing logic
    <Router>
      {/* 🛑 FIX: Wrap your entire application logic with the AuthProvider */}
      <AuthProvider>
        <TaskProvider>
      {/* 2. Routes component defines the routing area */}
      <Routes>
        {/* Public Routes (Full Screen, no Layout wrapper) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected/Main App Routes (Uses the Layout) */}
        {/* 3. The Layout route serves as the main structure */}
        <Route path="/" element={<Layout />}>
          
          {/* Default/Index route for the Layout (Home page) */}
          <Route index element={<Home />} />

          {/* Add protected routes here, e.g., <Route path="/tasks" element={<Tasks />} /> */}
          
          {/* We wrap the element in ProtectedRoute to ensure the user is logged in */}
            <Route 
              path="/tasks" 
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              } 
            />


          {/* Placeholder Routes (Uncomment/Add components when ready) */}
          {/* <Route path="/tasks" element={<Tasks />} /> */}
          {/* <Route path="/projects" element={<Projects />} /> */}
          {/* <Route path="/calendar" element={<Calendar />} /> */}
          {/* <Route path="/login" element={<Login />} /> */}
          
          {/* Catch-all route for any undefined paths (404 Page) */}
          <Route path="*" element={<NotFound />} />
        
        </Route>
      </Routes>
      </TaskProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;