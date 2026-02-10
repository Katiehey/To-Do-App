import { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Tag, AlertTriangle, Loader, Repeat } from 'lucide-react';
import DatePicker from 'react-datepicker';
import Modal from '../common/Modal';
import { 
  PRIORITY_LEVELS, 
  RECURRING_OPTIONS, 
  RECURRING_INTERVALS 
} from '../../utils/constants';
import { textClasses, subtextClasses, inputClasses, darkClass } from '../../utils/darkMode';
import { announceToScreenReader } from '../../utils/accessibility';

const AddTaskModal = ({ isOpen, onClose, onSubmit, initialTask = null, defaultDate = null }) => {
  const { projects, fetchProjects } = useProject();

  const [dateInputRaw, setDateInputRaw] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: null,
    tags: [],
    project: '',
    recurring: {
      enabled: false,
      frequency: 'daily',
      interval: 1,
      endDate: null,
    }
  });

  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  
  const resetForm = (newDate = null) => {
    const defaultProj = projects.find(p => p.isDefault)?._id || '';
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: newDate || defaultDate || null,
      tags: [],
      project: defaultProj,
      recurring: {
        enabled: false,
        frequency: 'daily',
        interval: 1,
        endDate: null,
      }
    });
    setTagInput('');
    setError('');
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchProjects();

    if (initialTask && isOpen) {
      setFormData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        priority: initialTask.priority || 'medium',
        dueDate: initialTask.dueDate ? new Date(initialTask.dueDate) : null,
        tags: Array.isArray(initialTask.tags) ? initialTask.tags : [],
        project: initialTask.project?._id || initialTask.project || '',
        recurring: {
          enabled: initialTask.recurring?.enabled || false,
          frequency: initialTask.recurring?.frequency || 'daily',
          interval: initialTask.recurring?.interval || 1,
          endDate: initialTask.recurring?.endDate ? new Date(initialTask.recurring.endDate) : null,
        }
      });
    } else {
      const defaultProj = projects.find(p => p.isDefault)?._id || '';
      setFormData(prev => ({ ...prev, project: prev.project || defaultProj }));
      resetForm(defaultDate);
    }
  }, [initialTask, isOpen, defaultDate, fetchProjects]);

  useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [isOpen, onClose]);

  const handleAddTag = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const val = tagInput.trim();
    if (!val) return;
    
    // Add this validation to match your test
    if (val.length > 30) {
      setError('Tag must be less than 30 characters');
      return;
    }
    
    if (!formData.tags.includes(val)) { 
      setFormData(prev => ({ ...prev, tags: [...prev.tags, val] })); 
    }
    setTagInput('');
    setError(''); // Clear error on success
  }
};

  const handleRemoveTag = (tagToRemove) => {
  setFormData(prev => ({
    ...prev,
    tags: prev.tags.filter(tag => tag !== tagToRemove)
  }));
  // Optional: Add screen reader announcement
  announceToScreenReader(`Removed tag ${tagToRemove}`);
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleRecurringChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      recurring: { ...prev.recurring, [field]: value }
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // 1. Validation: Title
  if (!formData.title.trim()) {
    setError('Title is required');
    return;
  }
  if (formData.title.length > 200) {
    setError('Title must be less than 200 characters');
    return;
  }

  // 2. Validation: Date
  // We check if the user typed something (dateInputRaw) but DatePicker couldn't parse it (formData.dueDate)
  if (dateInputRaw && (!formData.dueDate || isNaN(formData.dueDate.getTime()))) {
    setError('Please enter a valid date');
    return;
  }

  setLoading(true);

  // 3. Prepare Tags
  let finalTags = [...formData.tags];
  if (tagInput.trim()) {
    finalTags.push(tagInput.trim());
  }

  // 4. Construct Data object
  const taskData = {
    title: formData.title.trim(),
    description: formData.description.trim(),
    priority: formData.priority,
    project: formData.project,
    tags: [...new Set(finalTags)], // Remove duplicates
  };

  // 5. Handle Recurring Data
  if (formData.recurring.enabled) {
    taskData.recurring = {
      enabled: true,
      frequency: formData.recurring.frequency,
      interval: parseInt(formData.recurring.interval) || 1,
      endDate: formData.recurring.endDate ? formData.recurring.endDate.toISOString() : null,
    };
  }

  // 6. Submit
  let result; 
  if (initialTask?._id) { 
    result = await onSubmit(initialTask._id, taskData); 
  } else { 
    result = await onSubmit(taskData); 
  } 
  
  setLoading(false); 
  
  if (result.success) { 
    announceToScreenReader(initialTask ? 'Task updated successfully' : 'New task created successfully');
    resetForm(); 
    onClose(); 
  } else { 
    const errorMsg = result.error || 'Failed to save task';
    setError(errorMsg); 
    announceToScreenReader(`Error: ${errorMsg}`);
  } 
};

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialTask ? 'Edit Task' : 'Add New Task'}
      size="md"
    >
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="relative w-full max-w-2xl">
        <h2 id="modal-title" className="sr-only">
          {initialTask ? 'Edit Task' : 'Add New Task'}
        </h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {error && (
            <div className="flex items-center p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30" role="alert">
              <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title & Description */}
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className={darkClass("block text-sm font-semibold mb-1", textClasses)}>Title *</label>
              <input 
                id="title"
                name="title" 
                required 
                autoFocus
                value={formData.title} 
                onChange={handleChange} 
                className={darkClass(inputClasses, "w-full p-2.5 rounded-lg")} 
                placeholder="What needs to be done?" 
              />
            </div>
            <div>
              <label htmlFor="description" className={darkClass("block text-sm font-semibold mb-1", textClasses)}>Description</label>
              <textarea
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows="2" 
                className={darkClass(inputClasses, "w-full p-2.5 rounded-lg resize-none")} 
                placeholder="Add more details..." 
              />
            </div>
          </div>

          {/* Priority & Project */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className={darkClass("block text-sm font-semibold mb-1", textClasses)}>Priority</label>
              <select id="priority" name="priority" value={formData.priority} onChange={handleChange} className={darkClass(inputClasses, "w-full p-2.5 rounded-lg")}>
                {PRIORITY_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="project" className={darkClass("block text-sm font-semibold mb-1", textClasses)}>Project</label>
              <select id="project" name="project" value={formData.project} onChange={handleChange} className={darkClass(inputClasses, "w-full p-2.5 rounded-lg")}>
                <option value="" disabled>Select Project</option>
                {projects.filter(p => !p.isArchived).map(p => (
                  <option key={p._id || p.id} value={p._id || p.id}>{p.icon} {p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Due date & Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className={darkClass("block text-sm font-semibold mb-1", textClasses)}>Due Date</label>
              <DatePicker
                id="dueDate"
                name="dueDate"
                selected={formData.dueDate}
                onChange={(date) => {
    setFormData(prev => ({ ...prev, dueDate: date }));
    setDateInputRaw(''); // Clear raw text on valid selection
  }}
  onChangeRaw={(e) => setDateInputRaw(e.target.value)}
                showTimeSelect
                dateFormat="MMM d, yyyy h:mm aa"
                customInput={
    <input className={darkClass(inputClasses, "w-full p-2.5 rounded-lg")} />
  }
                placeholderText="Set deadline"
              />
            </div>
            <div>
              <label htmlFor="tags" className={darkClass("block text-sm font-semibold mb-1", textClasses)}>Tags</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="tags" 
                  name="tags" 
                  value={tagInput} 
                  onChange={(e) => setTagInput(e.target.value)} 
                  onKeyDown={handleAddTag}
                  className={darkClass(inputClasses, "w-full pl-9 pr-3 py-2.5 rounded-lg")} 
                  placeholder="Add tags..." 
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} aria-label={`remove ${tag} tag`} className="ml-1 hover:text-blue-900">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recurring */}
          <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
            <label 
              htmlFor="recurring-toggle" 
              className="flex items-center justify-between mb-4 cursor-pointer group"
            >
              <div className="flex items-center space-x-2">
                <Repeat 
                  className={darkClass(
                    "w-5 h-5", 
                    formData.recurring.enabled ? 'text-blue-600' : 'text-gray-400'
                  )} 
                />
                <span htmlFor="recurring-toggle" className={darkClass("text-sm font-semibold", textClasses)}>
                  Recurring Task
                </span>
              </div>

              <div className="relative inline-flex items-center">
                <input 
                  id="recurring-toggle"
                  name="recurring"
                  type="checkbox" 
                  checked={formData.recurring.enabled} 
                  onChange={(e) => handleRecurringChange('enabled', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all group-hover:ring-2 group-hover:ring-blue-300 dark:group-hover:ring-blue-800"></div>
              </div>
            </label>

            {formData.recurring.enabled && (
              <div className="space-y-4 bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="frequency-select" className="block text-xs font-bold text-gray-400 uppercase mb-1">Frequency</label>
                    <select 
                      id="frequency-select"
                      value={formData.recurring.frequency} 
                      onChange={(e) => {
                        handleRecurringChange('frequency', e.target.value);
                        handleRecurringChange('interval', 1);
                      }}
                      className={darkClass(inputClasses, "w-full p-2 text-sm rounded-lg")}
                    >
                      {RECURRING_OPTIONS.slice(1).map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="interval-input" className="block text-xs font-bold text-gray-400 uppercase mb-1">Interval</label>
                    <select 
                      id="interval-input"
                      value={formData.recurring.interval} 
                      onChange={(e) => handleRecurringChange('interval', e.target.value)}
                      className={darkClass(inputClasses, "w-full p-2 text-sm rounded-lg")}
                    >
                      {RECURRING_INTERVALS[formData.recurring.frequency]?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                </div>
                <DatePicker
                  id="recurring-end-date"
                  name="recurring-end-date"
                  selected={formData.recurring.endDate}
                  onChange={(date) => handleRecurringChange('endDate', date)}
                  placeholderText="Repeats indefinitely"
                  className={darkClass(inputClasses, "w-full p-2 text-sm rounded-lg")}
                  customInput={<input />}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4 gap-3 border-t border-gray-100 dark:border-slate-700">
            <button 
              type="button" 
              onClick={() => { onClose(); resetForm(); }} 
              className={darkClass("px-5 py-2 text-sm font-semibold", subtextClasses)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex items-center px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? <Loader className="animate-spin w-4 h-4 mr-2" /> : (initialTask ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddTaskModal;
