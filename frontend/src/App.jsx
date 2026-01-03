import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ProjectProvider } from './context/ProjectContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext'; // ✅ Added

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

function App() {
  return (
    <ThemeProvider> {/* ✅ Outermost provider to control document-level classes */}
      <Router>
        <AuthProvider>
          <TaskProvider>
            <ProjectProvider>
              <NotificationProvider>
                {/* Global PWA UI */}
                <OfflineIndicator />
                <InstallPrompt />

                <Routes>
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
              </NotificationProvider>
            </ProjectProvider>
          </TaskProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;