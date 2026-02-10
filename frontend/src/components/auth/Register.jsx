import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import { User, Mail, Lock, AlertCircle, Loader, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { cardClasses, textClasses, subtextClasses, darkClass } from '../../utils/darkMode';

const PasswordRequirement = ({ met, text }) => (
  <div className={`flex items-center text-xs font-medium ${met ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
    {met ? <CheckCircle className="w-3.5 h-3.5 mr-2" /> : <AlertCircle className="w-3.5 h-3.5 mr-2" />}
    {text}
  </div>
);

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ hasLength: false, hasUpper: false, hasLower: false, hasNumber: false });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');

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
  
  // Validation
  if (formData.password !== formData.confirmPassword) {
    setError('Passwords do not match');
    return;
  }
  
  if (!Object.values(passwordStrength).every(Boolean)) {
    setError('Password requirements not met');
    return;
  }
  
  setLoading(true);
  setError('');
  
  console.log('📝 [Register] Attempting registration...');
  
  try {
    const result = await register(formData.name, formData.email, formData.password);
    console.log('📊 [Register] Registration result:', result);
    
    if (result.success) {
      setTimeout(() => {
    console.log('🚀 Navigating to /tasks');
    navigate('/tasks');
  }, 100);
    } else {
      console.error('❌ [Register] Failed:', result.error);
      setError(result.error || 'Registration failed');
    }
  } catch (error) {
    console.error('❌ [Register] Unexpected error:', error);
    setError('An unexpected error occurred');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  // Test API connection
  fetch('https://taskmaster-pro-backend-vqwm.onrender.com/api/health')
    .then(r => r.json())
    .then(data => console.log('Backend health:', data))
    .catch(err => console.error('Backend connection failed:', err));
}, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent p-4 transition-colors duration-300">
      <div className={darkClass(cardClasses, "w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700")}>
        
        <div className="text-center mb-8">
          <h1 className={darkClass("text-3xl font-bold", textClasses)}>Create account</h1>
          <p className={subtextClasses + " mt-1"}>Start organizing your tasks today</p>
        </div>

        {error && (
          <div className="flex items-center p-4 mb-4 text-sm text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800/50" role="alert">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkClass("text-gray-700", textClasses)}`}>Full name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                name="name" type="text" required value={formData.name} onChange={handleChange} autoComplete="name"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="John Doe" disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkClass("text-gray-700", textClasses)}`}>Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                name="email" type="email" required value={formData.email} onChange={handleChange} autoComplete="email"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="you@example.com" disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkClass("text-gray-700", textClasses)}`}>Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                name="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleChange} autoComplete="new-password"
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="••••••••" disabled={loading}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {formData.password && (
            <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
              <PasswordRequirement met={passwordStrength.hasLength} text="6+ Characters" />
              <PasswordRequirement met={passwordStrength.hasUpper} text="Uppercase" />
              <PasswordRequirement met={passwordStrength.hasLower} text="Lowercase" />
              <PasswordRequirement met={passwordStrength.hasNumber} text="Number" />
            </div>
          )}

          {/* Confirm Password */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkClass("text-gray-700", textClasses)}`}>Confirm password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required value={formData.confirmPassword} onChange={handleChange}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="••••••••" disabled={loading}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <><Loader className="animate-spin -ml-1 mr-3 h-5 w-5" /> Creating...</> : 'Create account'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700 text-center space-y-4">
          <p className={subtextClasses}>
            Already have an account? 
            <Link to="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline ml-1">Sign in</Link>
          </p>
          <Link to="/" className="block text-sm font-medium text-gray-400 hover:text-blue-500 transition-colors">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;