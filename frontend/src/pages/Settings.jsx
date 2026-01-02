import { useState } from 'react';
import NotificationSettings from '../components/settings/NotificationSettings';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('profile'); // default view

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-blue-600" />
          Settings
        </h1>
        <p className="text-gray-500">Manage your account, preferences, and notifications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          <button
            onClick={() => setActiveSection('notifications')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl shadow-sm border transition ${
              activeSection === 'notifications'
                ? 'bg-white text-blue-600 font-bold border-blue-100'
                : 'bg-blue-600 text-white font-medium border-blue-600 hover:bg-blue-700'
            }`}
          >
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </button>
          <button
            onClick={() => setActiveSection('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl shadow-sm border transition ${
              activeSection === 'profile'
                ? 'bg-white text-blue-600 font-bold border-blue-100'
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
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-inner">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-500">{user?.email}</p>
                  
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
