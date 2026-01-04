import { useState, useEffect } from 'react';
import { AlertTriangle, Loader } from 'lucide-react';
import Modal from '../common/Modal'; // ✅ Import wrapper
import { textClasses, subtextClasses, inputClasses, darkClass } from '../../utils/darkMode';

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
    { name: 'Home', value: '🏠' }, { name: 'Work', value: '💼' },
    { name: 'Book', value: '📚' }, { name: 'Heart', value: '❤️' },
    { name: 'Star', value: '⭐' }, { name: 'Rocket', value: '🚀' },
    { name: 'Light', value: '💡' }, { name: 'Target', value: '🎯' },
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

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialProject ? 'Edit Project' : 'Create New Project'}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
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
            placeholder="Brief overview"
          />
        </div>

        <div>
          <label className={darkClass("block text-sm font-medium mb-2", textClasses)}>Color</label>
          <div className="grid grid-cols-8 gap-2">
            {colorOptions.map(color => (
              <button
                key={color.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                className={`h-7 rounded-md transition-all border-2 ${
                  formData.color === color.value ? 'border-slate-400 scale-110' : 'border-transparent'
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
                className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center transition-all ${
                  formData.icon === icon.value ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-slate-700'
                }`}
              >
                {icon.value || 'None'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100 dark:border-slate-700">
          <button type="button" onClick={onClose} className={subtextClasses}>Cancel</button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50" disabled={loading}>
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;