import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Calendar,
  Clock,
  Tag,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle2,
  Circle,
  Timer,
  AlertCircle,
} from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Timer className="h-4 w-4 text-blue-600" />;
      default: return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const isOverdue = (dueDate) => {
    return dueDate && new Date(dueDate) < new Date();
  };

  const handleStatusToggle = () => {
    const nextStatus = task.status === 'done' ? 'todo' : 'done';
    onStatusChange(task, nextStatus);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={`group hover:shadow-md transition-all duration-200 ${
        task.status === 'done' ? 'opacity-75' : ''
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-300 dark:hover:border-blue-600">
        <div className="flex items-start gap-3">
          {/* Status Checkbox */}
          <button
            onClick={handleStatusToggle}
            className="mt-1 flex-shrink-0 transition-colors hover:scale-110"
          >
            {getStatusIcon(task.status)}
          </button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-gray-900 dark:text-white truncate ${
                  task.status === 'done' ? 'line-through text-gray-500 dark:text-gray-400' : ''
                }`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}
                
                {/* Tags */}
                {task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {task.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {task.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{task.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onStatusChange(task, 'todo')}
                    className={task.status === 'todo' ? 'bg-accent' : ''}
                  >
                    <Circle className="mr-2 h-4 w-4" />
                    Mark as To Do
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onStatusChange(task, 'in-progress')}
                    className={task.status === 'in-progress' ? 'bg-accent' : ''}
                  >
                    <Timer className="mr-2 h-4 w-4" />
                    Mark as In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onStatusChange(task, 'done')}
                    className={task.status === 'done' ? 'bg-accent' : ''}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark as Done
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(task.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Meta Information */}
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
              {/* Priority */}
              <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </Badge>

              {/* Due Date */}
              {task.dueDate && (
                <div className={`flex items-center gap-1 ${
                  isOverdue(task.dueDate) ? 'text-red-600 dark:text-red-400' : ''
                }`}>
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(task.dueDate).toLocaleDateString()}
                    {isOverdue(task.dueDate) && ' (Overdue)'}
                  </span>
                </div>
              )}

              {/* Estimated Time */}
              {task.estimatedTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{task.estimatedTime}m</span>
                </div>
              )}

              {/* Overdue Warning */}
              {isOverdue(task.dueDate) && task.status !== 'done' && (
                <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  <span>Overdue</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
