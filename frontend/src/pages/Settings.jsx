import { useState } from 'react';
import NotificationSettings from '../components/settings/NotificationSettings';
import PageTransition from '../components/common/PageTransition';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Settings as SettingsIcon } from 'lucide-react';
import { cardClasses, textClasses, subtextClasses, darkClass } from '../utils/darkMode';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');

  // Utility to handle the sidebar button styling
  const getNavButtonStyle = (section) => {
    const isActive = activeSection === section;
    if (isActive) {
      return darkClass(
        "w-full flex items-center space-x-3 px-4 py-3 rounded-xl shadow-md border-2 transition-all font-bold",
        "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50"
      );
    }
    return darkClass(
      "w-full flex items-center space-x-3 px-4 py-3 rounded-xl shadow-sm border transition-all font-medium",
      "bg-blue-600 dark:bg-slate-700 text-white border-blue-600 dark:border-slate-600 hover:bg-blue-700 dark:hover:bg-slate-600"
    );
  };

  return (
    <PageTransition>
      <div className="p-4 sm:p-8 max-w-5xl mx-auto min-h-screen">
        <div className="mb-8">
          <h1 className={darkClass("text-3xl font-bold flex items-center gap-3", textClasses)}>
            <SettingsIcon className="w-8 h-8 text-blue-600" /> Settings
          </h1>
          <p className={subtextClasses}>Manage your account, preferences, and notifications.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-3">
            <button 
              onClick={() => setActiveSection('profile')} 
              className={getNavButtonStyle('profile')}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
            <button 
              onClick={() => setActiveSection('notifications')} 
              className={getNavButtonStyle('notifications')}
            >
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {activeSection === 'profile' ? (
              <div className={darkClass(cardClasses, "p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700")}>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 h-24 w-24 rounded-2xl flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-blue-500/20">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className={darkClass("text-2xl font-bold", textClasses)}>{user?.name}</h2>
                    <p className={subtextClasses}>{user?.email}</p>
                    <div className="mt-4 inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                      Free Tier Account
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={darkClass(cardClasses, "rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden")}>
                <NotificationSettings />
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Settings;