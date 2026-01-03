import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react'; 
import { cardClasses, textClasses, subtextClasses, darkClass } from '../../utils/darkMode';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    setError('');
    setLoading(true);
    try {
      const result = await login(formData.email, formData.password); 
      if (result.success) navigate('/tasks');
      else setError(result.error); 
    } catch (err) {
      setError("An unexpected network error occurred."); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent p-4 transition-colors duration-300">
      <div className={darkClass(cardClasses, "w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700")}>
        
        <div className="text-center mb-8">
          <h1 className={darkClass("text-3xl font-bold", textClasses)}>Welcome back</h1>
          <p className={subtextClasses + " mt-1"}>Sign in to your account to continue</p>
        </div>

        {error && (
          <div className="flex items-center p-4 mb-4 text-sm text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800/50" role="alert">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-1 ${darkClass("text-gray-700", textClasses)}`}>
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
                autoComplete="email"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={`block text-sm font-medium mb-1 ${darkClass("text-gray-700", textClasses)}`}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"} 
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <><Loader className="animate-spin -ml-1 mr-3 h-5 w-5" /> Signing in...</> : 'Sign in'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700 text-center space-y-4">
          <p className={subtextClasses}>
            Don't have an account? 
            <Link to="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:underline ml-1">Sign up</Link>
          </p>
          <Link to="/" className="block text-sm font-medium text-gray-400 hover:text-blue-500 transition-colors">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;