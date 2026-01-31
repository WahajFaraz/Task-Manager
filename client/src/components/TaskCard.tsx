import React from 'react';
import { motion } from 'framer-motion';
import { Task, TaskPriority } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Tag, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  isDragging?: boolean;
}

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  high: { label: 'High', className: 'priority-high' },
  medium: { label: 'Medium', className: 'priority-medium' },
  low: { label: 'Low', className: 'priority-low' },
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, isDragging }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  const priority = priorityConfig[task.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className={`
        p-4 rounded-xl bg-card border border-border/50 shadow-card
        transition-all duration-200 cursor-grab active:cursor-grabbing
        ${isDragging ? 'shadow-lg ring-2 ring-primary/20' : ''}
        ${isOverdue ? 'border-l-4 border-l-destructive' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-foreground line-clamp-2">{task.title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(task)} className="gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete?.(task.id)}
              className="gap-2 text-destructive"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {task.description && (
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <Badge variant="outline" className={priority.className}>
          {priority.label}
        </Badge>
        {task.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            <Tag className="w-3 h-3 mr-1" />
            {tag}
          </Badge>
        ))}
        {task.tags.length > 2 && (
          <Badge variant="secondary" className="text-xs">
            +{task.tags.length - 2}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        {task.dueDate && (
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-destructive' : ''}`}>
            <Calendar className="w-3 h-3" />
            {new Date(task.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </div>
        )}
        {task.estimatedTime && (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {Math.floor(task.estimatedTime / 60)}h {task.estimatedTime % 60}m
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;
