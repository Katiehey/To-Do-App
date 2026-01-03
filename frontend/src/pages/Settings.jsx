import { useState } from 'react';
import NotificationSettings from '../components/settings/NotificationSettings';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Settings as SettingsIcon } from 'lucide-react';
import { cardClasses, textClasses, subtextClasses, darkClass } from '../utils/darkMode';

const Settings = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="mb-8">
        <h1 className={darkClass("text-3xl font-bold flex items-center gap-3", textClasses)}>
          <SettingsIcon className="w-8 h-8 text-blue-600" />
          Settings
        </h1>
        <p className={subtextClasses}>Manage your account, preferences, and notifications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          <button
            onClick={() => setActiveSection('notifications')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl shadow-sm border transition-all ${
              activeSection === 'notifications'
                ? 'bg-white dark:bg-dark-card text-blue-600 dark:text-blue-400 font-bold border-blue-100 dark:border-dark-border'
                : 'bg-blue-600 text-white font-medium border-blue-600 hover:bg-blue-700'
            }`}
          >
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </button>
          <button
            onClick={() => setActiveSection('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl shadow-sm border transition-all ${
              activeSection === 'profile'
                ? 'bg-white dark:bg-dark-card text-blue-600 dark:text-blue-400 font-bold border-blue-100 dark:border-dark-border'
                : 'bg-blue-600 text-white font-medium border-blue-600 hover:bg-blue-700'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Profile Details</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === 'profile' && (
            <div className={darkClass(cardClasses, "p-6 rounded-2xl shadow-sm transition-colors")}>
              <div className="flex items-center space-x-6">
                <div className="bg-blue-600 h-20 w-20 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 className={darkClass("text-2xl font-bold", textClasses)}>{user?.name}</h2>
                  <p className={subtextClasses}>{user?.email}</p>
                  <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                    Active Account
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <NotificationSettings />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;