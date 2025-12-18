import { useState } from 'react';
import { X, AlertTriangle, Archive, Trash2, Save, Loader2 } from 'lucide-react';

const ProjectSettings = ({ project, onClose, onUpdate, onArchive, onDelete }) => {
  const [settings, setSettings] = useState({
    name: project.name,
    description: project.description || '',
    color: project.color || '#3B82F6',
    icon: project.icon || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    const result = await onUpdate(settings);
    setLoading(false);
    
    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Failed to update project');
    }
  };

  const handleArchive = async () => {
    if (window.confirm(`Are you sure you want to ${project.isArchived ? 'unarchive' : 'archive'} this project?`)) {
      await onArchive();
      onClose();
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      const result = await onDelete();
      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Failed to delete project');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">Project Settings</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Project Name</label>
              <input
                type="text"
                name="name"
                value={settings.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={settings.description}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-grow">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Theme Color</label>
                <input
                  type="color"
                  name="color"
                  value={settings.color}
                  onChange={handleChange}
                  className="w-full h-10 p-1 rounded-lg border border-gray-200 cursor-pointer"
                />
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl border shadow-sm" style={{ backgroundColor: settings.color }}>
                {settings.icon || '📁'}
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3">Danger Zone</h3>
            <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 space-y-3">
              <button
                onClick={handleArchive}
                disabled={project.isDefault}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 rounded-lg transition disabled:opacity-50"
              >
                <span className="flex items-center"><Archive className="w-4 h-4 mr-2" /> {project.isArchived ? 'Unarchive' : 'Archive'} Project</span>
              </button>
              
              {!project.isDefault ? (
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 rounded-lg transition"
                >
                  <span className="flex items-center"><Trash2 className="w-4 h-4 mr-2" /> Delete Project</span>
                </button>
              ) : (
                <p className="text-[10px] text-gray-500 italic flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" /> Default project cannot be modified.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 transition">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 shadow-md shadow-blue-200"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;