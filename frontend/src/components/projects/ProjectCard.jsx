import { motion } from 'framer-motion';
import { Edit2, Trash2, Archive, Settings, FolderOpen, CheckCircle, BarChart3 } from 'lucide-react';
import { hoverScale, buttonPress, fadeInUp } from '../../utils/animations';
import { ProgressRing } from '../common/SuccessAnimation';
import { cardClasses, textClasses, subtextClasses, darkClass } from '../../utils/darkMode';

const ProjectCard = ({ project, onEdit = () => {}, onDelete = () => {}, onArchive = () => {}, onClick = () => {}, onSettings = () => {} }) => {
  // Logic from original version to ensure data accuracy
  const totalTasks = project.taskCount || 0;
  const completedTasks = project.completedTaskCount || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      className="group relative"
    >
      <motion.div
        variants={hoverScale}
        onClick={() => onClick && onClick(project._id)}
        className={darkClass(
          cardClasses,
          "relative overflow-hidden cursor-pointer transition-all duration-300 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl",
          project.isArchived ? 'opacity-60' : 'opacity-100'
        )}
      >
        {/* Animated Color Top-Bar */}
        <motion.div
          className="h-1.5 w-full"
          style={{ backgroundColor: project.color || '#3B82F6' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: 'circOut' }}
        />

        <div className="p-6">
          {/* Header & Actions */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-black/5 dark:border-white/5"
                  style={{ backgroundColor: `${project.color}20`, color: project.color }}
                >
                  {project.icon ? (
                    <span className="text-xl">{project.icon}</span>
                  ) : (
                    <FolderOpen size={20} />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className={darkClass("text-lg font-bold truncate", textClasses)}>
                    {project.name}
                  </h3>
                  <div className="flex gap-2 mt-0.5">
                    {project.isDefault && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">Default</span>
                    )}
                    {project.isArchived && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">Archived</span>
                    )}
                  </div>
                </div>
              </div>
              {project.description && (
                <p className={darkClass("text-sm line-clamp-2", subtextClasses)}>
                  {project.description}
                </p>
              )}
            </div>

            {/* Floating Action Menu (Reveals on Hover) */}
            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              <motion.button
                variants={buttonPress}
                onClick={(e) => { e.stopPropagation(); onSettings(project); }}
                className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <Settings size={16} />
              </motion.button>
              <motion.button
                variants={buttonPress}
                onClick={(e) => { e.stopPropagation(); onEdit(project); }}
                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Edit2 size={16} />
              </motion.button>
              <motion.button
                variants={buttonPress}
                onClick={(e) => { e.stopPropagation(); onArchive(project._id); }}
                className="p-2 text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20"
              >
                <Archive size={16} />
              </motion.button>
              {!project.isDefault && (
                <motion.button
                  variants={buttonPress}
                  onClick={(e) => { e.stopPropagation(); onDelete(project._id); }}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 size={16} />
                </motion.button>
              )}
            </div>
          </div>

          {/* Progress & Stats Footer */}
          <div className="pt-4 border-t border-gray-50 dark:border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ProgressRing 
                progress={progress} 
                size={50} 
                colorClass={progress === 100 ? "text-green-500" : "text-blue-500"} 
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={darkClass("text-sm font-bold", textClasses)}>{completedTasks} / {totalTasks}</span>
                  <CheckCircle size={12} className="text-green-500" />
                </div>
                <p className={darkClass("text-[10px] font-bold uppercase tracking-tighter opacity-60", subtextClasses)}>
                  Tasks Completed
                </p>
              </div>
            </div>

            {/* Completion Status */}
            {progress === 100 && totalTasks > 0 ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full"
              >
                <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
              </motion.div>
            ) : (
              <div className="text-right">
                <BarChart3 size={18} className="text-gray-300 dark:text-slate-600 ml-auto" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectCard;