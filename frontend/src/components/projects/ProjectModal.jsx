import { useState, useEffect } from 'react';
import { X, AlertTriangle, Loader } from 'lucide-react';

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
    { name: 'None', value: '' }, // Add an option to clear the icon
    { name: 'Home', value: '🏠' },
    { name: 'Work', value: '💼' },
    { name: 'Book', value: '📚' },
    { name: 'Heart', value: '❤️' },
    { name: 'Star', value: '⭐' },
    { name: 'Rocket', value: '🚀' },
    { name: 'Light', value: '💡' },
    { name: 'Target', value: '🎯' },
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      icon: '',
    });
    setError('');
  };

  useEffect(() => {
    if (isOpen) { // Only update/reset when modal opens
      if (initialProject) {
        setFormData({
          name: initialProject.name || '',
          description: initialProject.description || '',
          color: initialProject.color || '#3B82F6',
          icon: initialProject.icon || '',
        });
      } else {
        resetForm();
      }
      setError(''); // Clear error on open
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
    setError('');

    // Ensure we send a valid color string (default to blue if somehow missing)
    const dataToSend = { ...formData, color: formData.color || '#3B82F6' };
    
    const result = await onSubmit(dataToSend);
    setLoading(false);
    
    if (result.success) {
      // Note: Do not reset form here, let the useEffect handle reset upon successful closing,
      // or simply rely on the parent component managing the state correctly.
      onClose(); 
    } else {
      setError(result.error || 'Failed to save project');
    }
  };

  if (!isOpen) return null;

  return (
    // Modal Overlay
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto" onClick={onClose}>
      
      {/* Modal Content */}
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto  my-10 max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-800">
            {initialProject ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full transition"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Error Alert */}
          {error && (
            <div className="flex items-center p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Personal Goals"
              maxLength={100}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief overview of the project"
              maxLength={500}
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="grid grid-cols-8 gap-3">
              {colorOptions.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                  className={`h-10 rounded-lg transition-all border-2 border-transparent ${
                    formData.color === color.value
                      ? 'ring-2 ring-offset-2 ring-blue-500 scale-105'
                      : 'hover:scale-105 hover:opacity-80'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                  aria-pressed={formData.color === color.value}
                />
              ))}
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map(icon => (
                <button
                  key={icon.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon: icon.value }))}
                  className={`w-12 h-12 rounded-lg border-2 text-2xl flex items-center justify-center transition-all ${
                    formData.icon === icon.value
                      ? 'border-blue-500 bg-blue-50 scale-105'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  title={icon.name}
                  aria-pressed={formData.icon === icon.value}
                >
                  {icon.value}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              {/* Project Icon/Initial */}
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 mr-4"
                style={{ backgroundColor: formData.color, color: '#ffffff' }}
              >
                {formData.icon ? formData.icon : null}
              </div>
              
              {/* Text Info */}
              <div>
                <h4 className="text-base font-semibold text-gray-800">
                  {formData.name || 'Project Name'}
                </h4>
                <p className="text-sm text-gray-500 truncate">
                  {formData.description || 'No description'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : initialProject ? (
                'Update Project'
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;