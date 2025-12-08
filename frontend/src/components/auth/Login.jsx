import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// 🎯 FIX 1: Import the new icons you are using 🎯
import { Mail, Lock, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react'; 

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 🎯 FIX 2: Define the state variable for the toggle button 🎯
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prevFormData => ({ // Using functional update is safer
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(formData.email, formData.password); 
    
    if (result.success) {
      navigate('/tasks');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    // Outer container for centering the form
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      
      {/* 🎯 FIX 3: Add text-gray-900 here to ensure text is visible on white background 🎯 */}
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl text-gray-900">
        
        {/* MODIFIED form with Home Link */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back
          </h1>
          <p className="text-gray-500 mt-1">
            Sign in to your account to continue
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Field (Updated with dynamic type and styling) */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                name="password"
                // Dynamically set type based on state
                type={showPassword ? "text" : "password"} 
                required
                value={formData.password}
                onChange={handleChange}
                // Updated pr-10 for spacing, added text-gray-900 for visibility
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="••••••••"
                disabled={loading}
              />
              {/* Styled Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 
                           p-1 rounded-full text-gray-400 hover:text-gray-600 
                           hover:bg-gray-100/50 focus:outline-none focus:ring-2 focus:ring-blue-500 
                           transition duration-150"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {/* Smaller icon size (w-4 h-4) */}
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition duration-150"
          >
            {loading ? (
              <>
                <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? 
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 ml-1">
              Sign up
            </Link>
          </p>
        </div>
        {/* Add this before the very last closing </div> in Login/Register.jsx */}
        <div className="mt-6 text-center">
            <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition duration-150">
                ← Back to Homepage
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
