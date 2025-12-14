import { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { X, Tag, AlertTriangle, Loader } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { PRIORITY_LEVELS } from '../../utils/constants';

const AddTaskModal = ({ isOpen, onClose, onSubmit, initialTask = null }) => {
  const { projects, fetchProjects } = useProject();

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: null, // store as JS Date
    tags: '',
    project: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        priority: initialTask.priority || 'medium',
        dueDate: initialTask.dueDate ? new Date(initialTask.dueDate) : null,
        tags: Array.isArray(initialTask.tags) ? initialTask.tags.join(', ') : '',
        project: initialTask.project?._id || '',
      });
    } else {
      resetForm();
    }
  }, [initialTask, isOpen]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: null,
      tags: '',
      project: projects.find(p => p.isDefault)?._id || null,
    });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    

    setLoading(true);
    setError('');

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
    };

    if (formData.dueDate) {
      taskData.dueDate = formData.dueDate.toISOString();
    }

    if (formData.tags) {
      taskData.tags = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
    }

    if (formData.project) {
      taskData.project = formData.project;
    }

    const result = await onSubmit(taskData);
    setLoading(false);

    if (result.success) {
      resetForm();
      onClose();
    } else {
      setError(result.error || 'Failed to save task');
    }
  };

  if (!isOpen) return null;

  const isEditMode = !!initialTask;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEditMode ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Complete Session 10"
              disabled={loading}
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
              rows="3"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Build task UI components"
              disabled={loading}
            />
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              {PRIORITY_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date with Time */}
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date & Time
            </label>
            <DatePicker
              id="dueDate"
              selected={formData.dueDate}
              onChange={(date) => setFormData((prev) => ({ ...prev, dueDate: date }))}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              dateFormat="yyyy-MM-dd HH:mm"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              placeholderText="Select date and time"
              disabled={loading}
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                placeholder="development, frontend"
                disabled={loading}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
          </div>

          {/* Project Field - Integrated */}
        <div>
            <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-1">
                Project
            </label>
            <select
                id="project"
                name="project"
                value={formData.project || ''} // Use empty string for null selection
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="" disabled>Select a Project</option>
                
                {/* Find the default project ID if available */}
                {projects.filter(p => !p.isArchived).map(project => (
                    <option key={project._id} value={project._id}>
                        {project.icon} {project.name}
                        {project.isDefault && " (Default)"}
                    </option>
                ))}
            </select>
            
            {/* Display current default project name as a hint if no project is selected */}
            {!formData.projectId && (
                <p className="mt-1 text-xs text-gray-500">
                    Currently set to: **{projects.find(p => p.isDefault)?.name || "No Default Project"}**
                </p>
            )}
        </div>

          {/* Actions */}
          <div className="flex justify-end pt-4 space-x-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => { onClose(); resetForm(); }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin w-4 h-4 mr-2" />
                  Saving...
                </>
              ) : (
                isEditMode ? 'Update Task' : 'Add Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
