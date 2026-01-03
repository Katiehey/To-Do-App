import { useState, useEffect } from 'react';
import { X, AlertTriangle, Loader } from 'lucide-react';
import { cardClasses, textClasses, subtextClasses, inputClasses, darkClass } from '../../utils/darkMode';

const ProjectModal = ({ isOpen, onClose, onSubmit, initialProject = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    icon: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const colorOptions = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Green', value: '#10B981' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Orange', value: '#F97316' },
  ];
  
  const iconOptions = [
    { name: 'None', value: '' },
    { name: 'Home', value: '🏠' },
    { name: 'Work', value: '💼' },
    { name: 'Book', value: '📚' },
    { name: 'Heart', value: '❤️' },
    { name: 'Star', value: '⭐' },
    { name: 'Rocket', value: '🚀' },
    { name: 'Light', value: '💡' },
    { name: 'Target', value: '🎯' },
    { name: 'Music', value: '🎵' },
    { name: 'Fitness', value: '🏋️‍♂️' },
    { name: 'Travel', value: '✈️' },
    { name: 'Food', value: '🍔' },
    { name: 'Shopping', value: '🛒' },
    { name: 'Business', value: '🏪' },
    { name: 'Money', value: '💵' },
  ];

  useEffect(() => {
    if (isOpen) {
      if (initialProject) {
        setFormData({
          name: initialProject.name || '',
          description: initialProject.description || '',
          color: initialProject.color || '#3B82F6',
          icon: initialProject.icon || '',
        });
      } else {
        setFormData({ name: '', description: '', color: '#3B82F6', icon: '' });
      }
      setError('');
    }
  }, [initialProject, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }
    setLoading(true);
    const result = await onSubmit({ ...formData, color: formData.color || '#3B82F6' });
    setLoading(false);
    if (result.success) onClose(); 
    else setError(result.error || 'Failed to save project');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div 
        className={darkClass(cardClasses, "w-full max-w-lg mx-auto rounded-xl shadow-2xl my-10 max-h-[90vh] overflow-y-auto")} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-dark-border">
          <h2 className={darkClass("text-xl font-semibold", textClasses)}>
            {initialProject ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-full transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center p-3 text-sm text-red-700 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
              <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div>
            <label className={darkClass("block text-sm font-medium mb-1", textClasses)}>Project Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={darkClass(inputClasses, "w-full px-3 py-2 rounded-lg")}
              placeholder="e.g., Personal Goals"
              required
            />
          </div>

          <div>
            <label className={darkClass("block text-sm font-medium mb-1", textClasses)}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={darkClass(inputClasses, "w-full px-3 py-2 rounded-lg")}
              placeholder="Brief overview of the project"
            />
          </div>

          <div>
            <label className={darkClass("block text-sm font-medium mb-2", textClasses)}>Color</label>
            <div className="grid grid-cols-8 gap-3">
              {colorOptions.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                  className={`h-8 rounded-lg transition-all border-2 ${
                    formData.color === color.value ? 'border-blue-500 scale-110' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className={darkClass("block text-sm font-medium mb-2", textClasses)}>Icon</label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map(icon => (
                <button
                  key={icon.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon: icon.value }))}
                  className={`w-10 h-10 rounded-lg border-2 text-xl flex items-center justify-center transition-all ${
                    formData.icon === icon.value ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-dark-border hover:border-gray-400'
                  }`}
                >
                  {icon.value}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-dark-border">
            <div className="flex items-center p-4 bg-gray-50 dark:bg-dark-bg/50 rounded-lg border border-gray-200 dark:border-dark-border">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 mr-4 shadow-sm" style={{ backgroundColor: formData.color, color: '#ffffff' }}>
                {formData.icon || null}
              </div>
              <div>
                <h4 className={darkClass("text-base font-semibold", textClasses)}>{formData.name || 'Project Name'}</h4>
                <p className={subtextClasses}>{formData.description || 'No description'}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-dark-border">
            <button type="button" onClick={onClose} className={darkClass("px-4 py-2 transition", subtextClasses)} disabled={loading}>Cancel</button>
            <button type="submit" className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50" disabled={loading}>
              {loading ? <Loader className="w-5 h-5 mr-2 animate-spin" /> : (initialProject ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;