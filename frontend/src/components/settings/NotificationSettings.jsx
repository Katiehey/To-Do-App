import { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { Bell, BellOff, Clock, AlertCircle, CheckCircle, ShieldCheck, ShieldAlert } from 'lucide-react';

const NotificationSettings = () => {
  const { 
    notificationsEnabled, 
    preferences, 
    enableNotifications, 
    updatePreferences 
  } = useNotification();

  const [localPreferences, setLocalPreferences] = useState(preferences);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handleEnableNotifications = async () => {
    const granted = await enableNotifications();
    if (granted) {
      updatePreferences({ enabled: true });
    }
  };

  const handleToggle = (key) => {
    const updated = {
      ...localPreferences,
      [key]: !localPreferences[key]
    };
    setLocalPreferences(updated);
    updatePreferences(updated);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-1">
          <Bell className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
        </div>
        <p className="text-gray-500 text-sm">Manage how and when you want to be reminded of your tasks.</p>
      </div>

      {/* Browser Permission Status */}
      <div className={`p-6 rounded-2xl border-2 transition-all ${
        notificationsEnabled 
        ? 'bg-green-50 border-green-100' 
        : 'bg-amber-50 border-amber-100'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${notificationsEnabled ? 'bg-green-100' : 'bg-amber-100'}`}>
              {notificationsEnabled ? (
                <ShieldCheck className="w-6 h-6 text-green-600" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-amber-600" />
              )}
            </div>
            <div>
              <h3 className={`font-bold ${notificationsEnabled ? 'text-green-900' : 'text-amber-900'}`}>
                {notificationsEnabled ? 'Browser Notifications Active' : 'Notifications are Blocked'}
              </h3>
              <p className={`text-sm ${notificationsEnabled ? 'text-green-700' : 'text-amber-700'}`}>
                {notificationsEnabled 
                  ? 'Your browser is configured to show alerts.' 
                  : 'Please enable browser permissions to receive task reminders.'}
              </p>
            </div>
          </div>
          {!notificationsEnabled && (
            <button
              onClick={handleEnableNotifications}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg font-bold text-sm hover:bg-amber-700 transition shadow-md"
            >
              Enable Browser Access
            </button>
          )}
        </div>
      </div>

      {/* Notification Preferences List */}
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-opacity ${!notificationsEnabled ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Master Toggle */}
        <div className="p-6 border-b flex items-center justify-between hover:bg-gray-50 transition">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              {localPreferences.enabled ? <Bell className="w-5 h-5 text-blue-600" /> : <BellOff className="w-5 h-5 text-gray-400" />}
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Master Alert Toggle</h4>
              <p className="text-xs text-gray-500">Quickly enable or disable all task alerts.</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={localPreferences.enabled} 
              onChange={() => handleToggle('enabled')} 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        {/* Detailed Preferences */}
        <div className={`divide-y divide-gray-100 transition-all ${!localPreferences.enabled ? 'grayscale opacity-60' : ''}`}>
          
          {/* Due Soon Preference */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Clock className="w-5 h-5 text-purple-500" />
              <div>
                <h4 className="font-semibold text-gray-700 text-sm">Due Soon</h4>
                <p className="text-xs text-gray-500">Notify me 30 minutes before a task is due.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                disabled={!localPreferences.enabled}
                checked={localPreferences.dueSoon} 
                onChange={() => handleToggle('dueSoon')} 
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-purple-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
            </label>
          </div>

          {/* Overdue Preference */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <h4 className="font-semibold text-gray-700 text-sm">Overdue Alerts</h4>
                <p className="text-xs text-gray-500">Get notified when a task has passed its deadline.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                disabled={!localPreferences.enabled}
                checked={localPreferences.overdue} 
                onChange={() => handleToggle('overdue')} 
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-red-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
            </label>
          </div>

          {/* Custom Reminders */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <h4 className="font-semibold text-gray-700 text-sm">Custom Reminders</h4>
                <p className="text-xs text-gray-500">Show alerts for specific reminder dates you set.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                disabled={!localPreferences.enabled}
                checked={localPreferences.reminders} 
                onChange={() => handleToggle('reminders')} 
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;