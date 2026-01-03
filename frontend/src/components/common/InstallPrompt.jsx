import { useState, useEffect } from 'react';
import { Download, X, CheckCircle2, Share } from 'lucide-react';
import { cardClasses, textClasses, subtextClasses, darkClass } from '../../utils/darkMode';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) setShowPrompt(true);
    };

    const isApple = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isApple && !isStandalone) {
      setIsIOS(true);
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) setShowPrompt(true);
    }

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:w-96 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-500">
      {/* Container with theme-aware background */}
      <div className={darkClass(cardClasses, "backdrop-blur-lg border border-blue-100 dark:border-blue-900/30 rounded-2xl shadow-2xl p-5 overflow-hidden relative transition-colors duration-300")}>
        
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className={darkClass("font-bold text-lg", textClasses)}>Install TaskMaster</h3>
            <p className={subtextClasses + " mb-4"}>Add to home screen for a better experience.</p>
            
            <div className="space-y-2 mb-5">
              {[
                'Works offline & saves data',
                'Fast, native performance',
                'Instant task notifications'
              ].map((text) => (
                <div key={text} className={`flex items-center gap-2 text-xs font-medium ${darkClass("text-gray-600", textClasses)}`}>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  {text}
                </div>
              ))}
            </div>

            {isIOS ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800/30">
                <p className="text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2 leading-relaxed">
                  Tap <Share className="w-4 h-4" /> then <span className="font-bold">"Add to Home Screen"</span>
                </p>
              </div>
            ) : (
              <button
                onClick={handleInstall}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-500/20 active:scale-[0.98]"
              >
                Install Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;