import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center bg-gray-50 p-8">
      
      {/* 🛑 Status Code */}
      <h1 className="text-9xl font-extrabold text-gray-800">
        404
      </h1>
      
      {/* ⚠️ Error Message */}
      <h2 className="text-3xl font-bold text-red-600 mt-4 mb-2">
        Page Not Found
      </h2>
      
      {/* Description */}
      <p className="text-xl text-gray-600 mb-8">
        The page you're looking for doesn't exist.
      </p>
      
      {/* 🏠 Navigation Link */}
      <Link
        to="/" // Links back to the root route (Home)
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition duration-300"
      >
        <Home className="w-5 h-5 mr-2" />
        Back to Home
      </Link>
      
    </div>
  );
};

export default NotFound;