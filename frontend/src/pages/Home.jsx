import { Link } from 'react-router-dom';
import { CheckSquare, Users, Calendar, Bell } from 'lucide-react';
import { cardClasses, textClasses, subtextClasses, darkClass } from '../utils/darkMode';

const Home = () => {
  return (
    // Updated background to respond to dark mode
    <main className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      
      {/* 🦸 Hero Section */}
      <section className="text-center py-20 bg-white dark:bg-dark-card shadow-lg border-b border-transparent dark:border-dark-border transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4">
          <CheckSquare className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h1 className={darkClass("text-5xl font-extrabold mb-4 transition-colors", textClasses)}>
            Your Personal Task Manager
          </h1>
          <p className={darkClass("text-xl mb-8 transition-colors", subtextClasses)}>
            Organize your life, boost productivity, and never miss a deadline.
          </p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-500 transition duration-300 shadow-md hover:shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* 🚀 Features Section */}
      <section className="py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className={darkClass("text-3xl font-bold text-center mb-12 transition-colors", textClasses)}>
            Features Designed for Productivity
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature Card 1: Task Management */}
            <div className={darkClass(cardClasses, "p-6 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 group")}>
              <CheckSquare className="w-8 h-8 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className={darkClass("text-xl font-semibold mb-2", textClasses)}>
                Task Management
              </h3>
              <p className={subtextClasses}>
                Create, organize, and complete tasks efficiently.
              </p>
            </div>
            
            {/* Feature Card 2: Collaboration */}
            <div className={darkClass(cardClasses, "p-6 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 group")}>
              <Users className="w-8 h-8 text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className={darkClass("text-xl font-semibold mb-2", textClasses)}>
                Collaboration
              </h3>
              <p className={subtextClasses}>
                Share projects and work together seamlessly.
              </p>
            </div>
            
            {/* Feature Card 3: Calendar View */}
            <div className={darkClass(cardClasses, "p-6 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 group")}>
              <Calendar className="w-8 h-8 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className={darkClass("text-xl font-semibold mb-2", textClasses)}>
                Calendar View
              </h3>
              <p className={subtextClasses}>
                Visualize your tasks and deadlines with ease.
              </p>
            </div>
            
            {/* Feature Card 4: Reminders */}
            <div className={darkClass(cardClasses, "p-6 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 group")}>
              <Bell className="w-8 h-8 text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className={darkClass("text-xl font-semibold mb-2", textClasses)}>
                Reminders
              </h3>
              <p className={subtextClasses}>
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