import { Link } from 'react-router-dom';
import { CheckSquare, Users, Calendar, Bell } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import { cardClasses, textClasses, subtextClasses, darkClass } from '../utils/darkMode';
import { HomePageSEO } from '../components/common/SEO';

const Home = () => {
  return (
    <>
      {/* ✅ SEO component */}
      <HomePageSEO />

      <PageTransition>
        <main className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
          {/* Hero Section */}
          <section className="text-center py-20 bg-white dark:bg-dark-card shadow-lg border-b dark:border-dark-border">
            <div className="max-w-4xl mx-auto px-4">
              <CheckSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h1 className={darkClass("text-5xl font-extrabold mb-4", textClasses)}>
                Your Personal Task Manager
              </h1>
              <p className={darkClass("text-xl mb-8", subtextClasses)}>
                Organize your life, boost productivity, and never miss a deadline.
              </p>
              <Link
                to="/login"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition shadow-md"
              >
                Get Started
              </Link>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <h2 className={darkClass("text-3xl font-bold text-center mb-12", textClasses)}>
                Features Designed for Productivity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: CheckSquare, color: 'text-green-500', title: 'Task Management', desc: 'Create, organize, and complete tasks efficiently.' },
                  { icon: Users, color: 'text-yellow-500', title: 'Collaboration', desc: 'Share projects and work together seamlessly.' },
                  { icon: Calendar, color: 'text-red-500', title: 'Calendar View', desc: 'Visualize your tasks and deadlines with ease.' },
                  { icon: Bell, color: 'text-purple-500', title: 'Reminders', desc: 'Set up alerts so you never miss important deadlines.' }
                ].map((feat, i) => (
                  <div key={i} className={darkClass(cardClasses, "p-6 rounded-xl shadow-xl group")}>
                    <feat.icon className={`w-8 h-8 ${feat.color} mb-4 group-hover:scale-110 transition-transform`} />
                    <h3 className={darkClass("text-xl font-semibold mb-2", textClasses)}>
                      {feat.title}
                    </h3>
                    <p className={subtextClasses}>{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </PageTransition>
    </>
  );
};

export default Home;
