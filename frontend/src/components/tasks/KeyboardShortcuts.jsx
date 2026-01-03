import { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';
import { cardClasses, textClasses, subtextClasses, darkClass } from '../../utils/darkMode';

const KeyboardShortcuts = ({ onNewTask, onFocusSearch, onSelectAll, onClearSelection }) => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: 'N', description: 'Create new task' },
    { key: '/', description: 'Focus search' },
    { key: 'Ctrl/Cmd + A', description: 'Select all visible tasks' },
    { key: 'Esc', description: 'Clear selection / Close modal' },
    { key: '?', description: 'Show keyboard shortcuts' },
  ];

  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key.toLowerCase() === 'n' && !event.metaKey && !event.ctrlKey) onNewTask?.();
      if (event.key === '/' && !event.shiftKey && !event.metaKey && !event.ctrlKey && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
        event.preventDefault();
        onFocusSearch?.();
      }
      if (event.key.toLowerCase() === 'a' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        onSelectAll?.();
      }
      if (event.key === 'Escape') {
        if (isOpen) setIsOpen(false); else onClearSelection?.();
      }
      if ((event.key === '/' || event.code === 'Slash') && event.shiftKey && !isOpen) {
        setIsOpen(true);
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [isOpen, onNewTask, onFocusSearch, onSelectAll, onClearSelection]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-gray-800 dark:bg-blue-600 text-white rounded-full shadow-lg hover:bg-gray-700 dark:hover:bg-blue-700 transition-all z-30"
        title="Keyboard shortcuts"
      >
        <Keyboard className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={darkClass(cardClasses, "w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden")}>
        
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-slate-700">
          <h2 className={darkClass("text-xl font-semibold flex items-center space-x-2", textClasses)}>
            <Keyboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Shortcuts</span>
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className={subtextClasses}>{shortcut.description}</span>
              <span className="bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-100 px-2 py-1 rounded-md text-[10px] font-mono font-bold border border-gray-200 dark:border-slate-600 shadow-sm">
                {shortcut.key}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;