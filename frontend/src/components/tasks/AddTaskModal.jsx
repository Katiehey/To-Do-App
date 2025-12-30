import { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { X, Tag, AlertTriangle, Loader, Repeat } from 'lucide-react'; // ✅ Added Repeat
import DatePicker from 'react-datepicker';
import { 
  PRIORITY_LEVELS, 
  RECURRING_OPTIONS, 
  RECURRING_INTERVALS 
} from '../../utils/constants'; // ✅ Added recurring constants

const AddTaskModal = ({ isOpen, onClose, onSubmit, initialTask = null }) => {
  const { projects, fetchProjects } = useProject();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: null,
    tags: '',
    project: '',
    // ✅ Added recurring state
    recurring: {
      enabled: false,
      frequency: 'daily',
      interval: 1,
      endDate: null,
    }
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
        // ✅ Populating recurring data for edit mode
        recurring: {
          enabled: initialTask.recurring?.enabled || false,
          frequency: initialTask.recurring?.frequency || 'daily',
          interval: initialTask.recurring?.interval || 1,
          endDate: initialTask.recurring?.endDate ? new Date(initialTask.recurring.endDate) : null,
        }
      });
    } else {
      resetForm();
    }
  }, [initialTask, isOpen, projects]);

  const resetForm = () => {
    const defaultProj = projects.find(p => p.isDefault)?._id || '';
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: null,
      tags: '',
      project: defaultProj,
      recurring: {
        enabled: false,
        frequency: 'daily',
        interval: 1,
        endDate: null,
      }
    });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  // ✅ New handler for recurring sub-fields
  const handleRecurringChange = (field, value) => {
    console.log('Recurring change:', field, value);
    setFormData(prev => ({
      ...prev,
      recurring: { ...prev.recurring, [field]: value }
    }));
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
      project: formData.project,
    };

    if (formData.dueDate) taskData.dueDate = formData.dueDate.toISOString();
    
    if (formData.tags) {
      taskData.tags = formData.tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    }

    // ✅ Adding recurring data if enabled
    if (formData.recurring.enabled) {
      taskData.recurring = {
        enabled: true,
        frequency: formData.recurring.frequency,
        interval: parseInt(formData.recurring.interval) || 1,
      };
      if (formData.recurring.endDate) {
        taskData.recurring.endDate = formData.recurring.endDate.toISOString();
      }
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
  console.log('Recurring state:', formData.recurring);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg my-auto p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
          <h2 className="text-xl font-bold text-gray-800">{isEditMode ? 'Edit Task' : 'Create Task'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 transition"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
              <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
              <input name="title" required value={formData.title} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="Task name..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900" placeholder="Details..." />
            </div>
          </div>

          {/* Row: Priority & Project */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900">
                {PRIORITY_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Project</label>
              <select name="project" value={formData.project} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900">
                <option value="" disabled>Select Project</option>
                {projects.filter(p => !p.isArchived).map(p => (
                  <option key={p._id} value={p._id}>{p.icon} {p.name} {p.isDefault ? '(Default)' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row: Due Date & Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
              <DatePicker
                selected={formData.dueDate}
                onChange={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
                showTimeSelect
                dateFormat="MMM d, yyyy h:mm aa"
                className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholderText="Set deadline"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tags</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input name="tags" value={formData.tags} onChange={handleChange} className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="work, urgent" />
              </div>
            </div>
          </div>

          {/* ✅ Recurring Section */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Repeat className={`w-5 h-5 ${formData.recurring.enabled ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="text-sm font-semibold text-gray-700">Recurring Task</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.recurring.enabled} 
                  onChange={(e) => handleRecurringChange('enabled', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {formData.recurring.enabled && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Frequency</label>
                    <select 
                      value={formData.recurring.frequency} 
                      onChange={(e) => {
                        handleRecurringChange('frequency', e.target.value);
                        handleRecurringChange('interval', 1);
                      }}
                      className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    >
                      {RECURRING_OPTIONS.slice(1).map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Every</label>
                    <select 
                      value={formData.recurring.interval} 
                      onChange={(e) => handleRecurringChange('interval', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    >
                      {RECURRING_INTERVALS[formData.recurring.frequency]?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">End Date (Optional)</label>
                  <DatePicker
                    selected={formData.recurring.endDate}
                    onChange={(date) => handleRecurringChange('endDate', date)}
                    placeholderText="Repeats indefinitely"
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded-md font-medium">
                  Preview: {formData.recurring.interval == 1 
                    ? formData.recurring.frequency.charAt(0).toUpperCase() + formData.recurring.frequency.slice(1)
                    : `Every ${formData.recurring.interval} ${formData.recurring.frequency.replace('ly', 's').replace('day', 'days')}`}
                  {formData.recurring.endDate && ` until ${formData.recurring.endDate.toLocaleDateString()}`}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end pt-4 space-x-3">
            <button type="button" onClick={() => { onClose(); resetForm(); }} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 transition">Cancel</button>
            <button type="submit" disabled={loading} className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-100">
              {loading ? <><Loader className="animate-spin w-4 h-4 mr-2" /> Saving...</> : (isEditMode ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;