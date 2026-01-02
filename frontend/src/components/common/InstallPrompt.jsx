import { useState, useEffect } from 'react';
import { Download, X, CheckCircle2, Share } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Handle Chrome/Android "beforeinstallprompt"
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    // 2. Detect iOS (since iOS doesn't support the event above)
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
    // Hide for 24 hours rather than forever (optional)
    localStorage.setItem('pwa-install-dismissed', Date.now());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:w-96 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="bg-white/90 backdrop-blur-lg border border-blue-100 rounded-2xl shadow-2xl p-5 overflow-hidden relative">
        {/* Close Button */}
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">Install TaskMaster</h3>
            <p className="text-sm text-gray-500 mb-4">Add to home screen for a better experience.</p>
            
            <div className="space-y-2 mb-5">
              {[
                'Works offline & saves data',
                'Fast, native performance',
                'Instant task notifications'
              ].map((text) => (
                <div key={text} className="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  {text}
                </div>
              ))}
            </div>

            {isIOS ? (
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-800 flex items-center gap-2 leading-relaxed">
                  Tap <Share className="w-4 h-4" /> then <span className="font-bold">"Add to Home Screen"</span>
                </p>
              </div>
            ) : (
              <button
                onClick={handleInstall}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-100 active:scale-[0.98]"
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