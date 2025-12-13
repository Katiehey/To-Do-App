import { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

const KeyboardShortcuts = ({
  onNewTask,
  onFocusSearch,
  onSelectAll,
  onClearSelection,
}) => {
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
      // N → new task
      if (event.key.toLowerCase() === 'n' && !event.metaKey && !event.ctrlKey) {
        onNewTask?.();
      }

      // / → focus search (only when not typing in an input/textarea)
      if (
        event.key === '/' &&
        !event.shiftKey &&
        !event.metaKey &&
        !event.ctrlKey &&
        event.target.tagName !== 'INPUT' &&
        event.target.tagName !== 'TEXTAREA'
      ) {
        event.preventDefault();
        onFocusSearch?.();
      }

      // Ctrl/Cmd + A → select all
      if (event.key.toLowerCase() === 'a' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        onSelectAll?.();
      }

      // Esc → clear selection or close modal
      if (event.key === 'Escape') {
        if (isOpen) {
          setIsOpen(false);
        } else {
          onClearSelection?.();
        }
      }

      // ✅ Shift + / → show shortcuts (produces '?')
      if ((event.key === '/' || event.code === 'Slash') && event.shiftKey && !isOpen) {
        setIsOpen(true);
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [isOpen, onNewTask, onFocusSearch, onSelectAll, onClearSelection]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition z-30"
        title="Keyboard shortcuts"
        aria-label="Show keyboard shortcuts"
      >
        <Keyboard className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-40 bg-black bg-opacity-10 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2
            id="shortcuts-title"
            className="text-xl font-semibold text-gray-800 flex items-center space-x-2"
          >
            <Keyboard className="w-5 h-5 text-blue-600" />
            <span>Keyboard Shortcuts</span>
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition"
            aria-label="Close shortcuts"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">{shortcut.description}</span>
              <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs font-mono font-semibold shadow-sm">
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
