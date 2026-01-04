import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import { textClasses, subtextClasses, darkClass } from '../utils/darkMode';

const NotFound = () => {
  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8 transition-colors duration-300">
        
        {/* 🛑 Status Code */}
        <h1 className={darkClass("text-9xl font-extrabold", textClasses)}>
          404
        </h1>
        
        {/* ⚠️ Error Message */}
        <h2 className="text-3xl font-bold text-red-600 mt-4 mb-2">
          Page Not Found
        </h2>
        
        {/* Description */}
        <p className={darkClass("text-xl mb-8", subtextClasses)}>
          Oops! The page you're looking for has vanished into thin air.
        </p>
        
        {/* 🏠 Navigation Link */}
        <Link
          to="/" 
          className="inline-flex items-center px-8 py-3 border border-transparent text-base font-bold rounded-full shadow-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-300 transform hover:scale-105"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
        
      </div>
    </PageTransition>
  );
};

export default NotFound;