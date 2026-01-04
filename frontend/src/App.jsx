import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ProjectProvider } from './context/ProjectContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';

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

// ✅ Separate component to handle Location and AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {/* The key={location.pathname} is the "secret sauce". 
        It tells Framer Motion that the component has changed, 
        triggering the exit animation of the old page and entry of the new one.
      */}
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
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <TaskProvider>
            <ProjectProvider>
              <NotificationProvider>
                <OfflineIndicator />
                <InstallPrompt />

                {/* ✅ Use the AnimatedRoutes component here */}
                <AnimatedRoutes />

              </NotificationProvider>
            </ProjectProvider>
          </TaskProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;