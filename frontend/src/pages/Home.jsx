import { Link } from 'react-router-dom';
import { CheckSquare, Users, Calendar, Bell } from 'lucide-react';

const Home = () => {
  return (
    // Single parent element (main) wrapping all content
    <main className="min-h-screen bg-gray-50">
      
      {/* 🦸 Hero Section */}
      <section className="text-center py-20 bg-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4">
          <CheckSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Your Personal **Task Manager**
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Organize your life, boost productivity, and never miss a deadline.
          </p>
          <Link
            to="/login" // Assuming Get Started links to login/signup
            className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* 🚀 Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Features Designed for Productivity
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature Card 1: Task Management */}
            <div className="p-6 bg-white rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
              <CheckSquare className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Task Management
              </h3>
              <p className="text-gray-600">
                Create, organize, and complete tasks efficiently.
              </p>
            </div>
            
            {/* Feature Card 2: Collaboration */}
            <div className="p-6 bg-white rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
              <Users className="w-8 h-8 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Collaboration
              </h3>
              <p className="text-gray-600">
                Share projects and work together seamlessly.
              </p>
            </div>
            
            {/* Feature Card 3: Calendar View */}
            <div className="p-6 bg-white rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
              <Calendar className="w-8 h-8 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Calendar View
              </h3>
              <p className="text-gray-600">
                Visualize your tasks and deadlines with ease.
              </p>
            </div>
            
            {/* Feature Card 4: Reminders */}
            <div className="p-6 bg-white rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
              <Bell className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Reminders
              </h3>
              <p className="text-gray-600">
                Set up alerts so you never miss important deadlines.
              </p>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
};

export default Home;