import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  // Destructure user and loading from your authentication context
  const { user, loading } = useAuth(); 

  // 1. Show a loading state while authentication status is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">
        <Loader className="animate-spin w-6 h-6 mr-3 text-blue-600" />
        Loading...
      </div>
    );
  }

  // 2. If the user is NOT logged in, redirect them to the login page
  if (!user) {
    // The Navigate component from react-router-dom is used for redirection
    return <Navigate to="/login" replace />; 
  }

  // 3. If the user is logged in, render the child component (the protected page)
  return children;
};

export default ProtectedRoute;