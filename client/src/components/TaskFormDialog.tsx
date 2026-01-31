import React, { useState } from 'react';
import { useTask } from '@/context/TaskContext';
import { Task, TaskStatus, TaskPriority } from '@/types/task';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Loader2 } from 'lucide-react';

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  defaultStatus?: TaskStatus;
}

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
  open,
  onOpenChange,
  task,
  defaultStatus = 'todo',
}) => {
  const { addTask, updateTask } = useTask();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || defaultStatus,
    priority: task?.priority || 'medium' as TaskPriority,
    dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
    tags: task?.tags || [] as string[],
    estimatedTime: task?.estimatedTime?.toString() || '',
  });

  React.useEffect(() => {
    if (open) {
      console.log('TaskFormDialog: Dialog opened with task:', task);
      setFormData({
        title: task?.title || '',
        description: task?.description || '',
        status: task?.status || defaultStatus,
        priority: task?.priority || 'medium',
        dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
        tags: task?.tags || [],
        estimatedTime: task?.estimatedTime?.toString() || '',
      });
    }
  }, [open, task, defaultStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
        tags: formData.tags,
        estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : undefined,
      };

      if (task) {
        console.log('TaskFormDialog: Updating task with ID:', task.id, 'Full task object:', task);
        
        // Check for both id and _id fields
        const taskId = task.id || task._id;
        console.log('TaskFormDialog: Resolved task ID:', taskId);
        
        if (!taskId || taskId === 'undefined') {
          console.error('TaskFormDialog: Task ID is undefined or invalid:', taskId);
          throw new Error('Task ID is undefined or invalid');
        }
        await updateTask(taskId, taskData);
      } else {
        console.log('TaskFormDialog: Creating new task');
        await addTask(taskData);
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Task submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: TaskStatus) =>
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: TaskPriority) =>
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Estimated Time (minutes)</Label>
              <Input
                id="estimatedTime"
                type="number"
                min="0"
                value={formData.estimatedTime}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                placeholder="e.g., 120"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add a tag"
                className="flex-1"
              />
              <Button type="button" variant="secondary" size="icon" onClick={addTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.title.trim()}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : task ? (
                'Update Task'
              ) : (
                'Create Task'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormDialog;
