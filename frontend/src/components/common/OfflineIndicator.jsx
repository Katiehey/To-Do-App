import { useState, useEffect } from 'react';
import { WifiOff, Wifi, X } from 'lucide-react';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(true);
      // Automatically hide the "Back Online" success message after 3 seconds
      const timer = setTimeout(() => setShowBanner(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner && isOnline) return null;

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-500 transform ${
      showBanner ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
    }`}>
      <div className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl border ${
        isOnline 
          ? 'bg-green-600 border-green-500 text-white' 
          : 'bg-gray-900 border-gray-800 text-white'
      }`}>
        {isOnline ? (
          <>
            <Wifi className="w-5 h-5 animate-pulse" />
            <span className="font-semibold text-sm tracking-wide">Internet connection restored</span>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-sm tracking-wide text-gray-100">
              Offline Mode <span className="text-gray-400 font-normal border-l border-gray-700 ml-2 pl-2">Using cached data</span>
            </span>
            <button 
              onClick={() => setShowBanner(false)}
              className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;