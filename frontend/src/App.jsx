// frontend/src/App.jsx - FIXED
import { useEffect } from 'react'; // ✅ Already imported, but check it's there
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ProjectProvider } from './context/ProjectContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';
import { throttle } from './utils/performance';

// Components & Layout
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Projects from './components/projects/Projects';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import OfflineIndicator from './components/common/OfflineIndicator'; 
import InstallPrompt from './components/common/InstallPrompt';

// Pages
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import CalendarPage from './pages/Calendar';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Styles
import 'react-datepicker/dist/react-datepicker.css';
import './index.css';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected App Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          
          <Route 
            path="/tasks" 
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            } 
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  // ✅ Integrated throttle scroll logic
  useEffect(() => {
    const handleScroll = throttle(() => {
      // Logic for global scroll effects can go here
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <TaskProvider>
              <ProjectProvider>
                <NotificationProvider>
                  <OfflineIndicator />
                  <InstallPrompt />
                  <AnimatedRoutes />
                </NotificationProvider>
              </ProjectProvider>
            </TaskProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;