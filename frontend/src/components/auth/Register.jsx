import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Assuming useAuth and register are correctly defined
import { useAuth } from '../../context/AuthContext'; 
import { User, Mail, Lock, AlertCircle, Loader, CheckCircle, Eye, EyeOff } from 'lucide-react'; // Import Eye and EyeOff } from 'lucide-react';

// Utility component to display a single password requirement
const PasswordRequirement = ({ met, text }) => (
  <div className={`flex items-center text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}>
    {met ? (
      <CheckCircle className="w-4 h-4 mr-2" />
    ) : (
      <AlertCircle className="w-4 h-4 mr-2" />
    )}
    {text}
  </div>
);

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
  });
  
  // Add state to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Ensure you are creating a NEW object here
    setFormData(prevFormData => ({
      ...prevFormData, // Spread the previous state
      [name]: value,   // Update the specific field
    }));
    setError('');

    // Check password strength logic
    if (name === 'password') {
      setPasswordStrength({
        hasLength: value.length >= 6,
        hasUpper: /[A-Z]/.test(value),
        hasLower: /[a-z]/.test(value),
        hasNumber: /\d/.test(value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!Object.values(passwordStrength).every(Boolean)) {
      setError('Password does not meet all requirements');
      return;
    }
    
    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password);
    
    if (result.success) {
      navigate('/tasks');
    } else {
      // Assuming 'result.error' contains the backend error message
      setError(result.error); 
    }
    setLoading(false);
  };

  return (
    // Outer container for centering the form
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl text-gray-900"> {/* Add text-gray-900 here */}
        
        
        {/* Header (will inherit dark text color) */}
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create your account
          </h1>
          <p className="text-gray-500 mt-1">
            Start organizing your tasks today
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        
        {/* Form Inputs (will inherit dark text color, fixing the issue) */}
        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                // 💡 FIX: Add autocomplete for full name
                autoComplete="name"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
                disabled={loading}
              />
            </div>
          </div>

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
                // 💡 FIX: Add autocomplete for email
                autoComplete="email"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Field */}
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
                // 💡 FIX: Add autocomplete for new password
                autoComplete="password"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                disabled={loading}
              />
              {/* MODIFIED Toggle Button 1 (Smaller, subtle, translucent) */}
              {/* Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 
                           p-1 rounded-full text-gray-400 hover:text-gray-600 
                           hover:bg-gray-100/50 focus:outline-none focus:ring-2 focus:ring-blue-500 
                           transition duration-150"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {/* Make the icon itself smaller (w-4 h-4) */}
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="space-y-1">
              <PasswordRequirement met={passwordStrength.hasLength} text="Minimum 6 characters" />
              <PasswordRequirement met={passwordStrength.hasUpper} text="At least one uppercase letter" />
              <PasswordRequirement met={passwordStrength.hasLower} text="At least one lowercase letter" />
              <PasswordRequirement met={passwordStrength.hasNumber} text="At least one number" />
            </div>
          )}

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                // Dynamically set type based on state
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                disabled={loading}
              />
              {/* MODIFIED Toggle Button 2 (Smaller, subtle, translucent) */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 
                           p-1 rounded-full text-gray-400 hover:text-gray-600 
                           hover:bg-gray-100/50 focus:outline-none focus:ring-2 focus:ring-blue-500 
                           transition duration-150"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {/* Make the icon itself smaller (w-4 h-4) */}
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account? 
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 ml-1">
              Sign in
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

export default Register;