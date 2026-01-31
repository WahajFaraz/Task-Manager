import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTask } from '@/context/TaskContext';
import { Task, TaskStatus, TaskPriority } from '@/types/task';
import TaskFormDialog from '@/components/TaskFormDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Plus,
  Filter,
  SortAsc,
  Calendar,
  Clock,
  Tag,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle2,
  Circle,
  Timer,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type SortOption = 'created' | 'dueDate' | 'priority' | 'title';

const priorityWeight: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

const statusIcons: Record<TaskStatus, React.ElementType> = {
  todo: Circle,
  'in-progress': Timer,
  done: CheckCircle2,
};

const TaskList: React.FC = () => {
  const { tasks, deleteTask, updateTask } = useTask();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('created');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((task) => task.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        case 'title':
          return a.title.localeCompare(b.title);
        case 'created':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    console.log('TaskList: Editing task:', task);
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleStatusChange = (task: Task) => {
    console.log('TaskList: Changing status for task:', task.id);
    const statusOrder: TaskStatus[] = ['todo', 'in-progress', 'done'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    updateTask(task.id, { status: nextStatus });
  };

  return (
    <motion.div
      className="page-transition"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize all your tasks
          </p>
        </div>
        <Button onClick={handleCreateTask} className="gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border/50 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as TaskStatus | 'all')}
            >
              <SelectTrigger className="w-full md:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select
              value={priorityFilter}
              onValueChange={(value) => setPriorityFilter(value as TaskPriority | 'all')}
            >
              <SelectTrigger className="w-full md:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="w-full md:w-40">
                <SortAsc className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created">Newest First</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing {filteredAndSortedTasks.length} of {tasks.length} tasks
      </p>

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredAndSortedTasks.map((task) => {
            const StatusIcon = statusIcons[task.status];
            const isOverdue =
              task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card
                  className={`border-border/50 hover-lift ${
                    isOverdue ? 'border-l-4 border-l-destructive' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Status Toggle */}
                      <button
                        onClick={() => handleToggleStatus(task)}
                        className={`
                          mt-1 transition-colors
                          ${task.status === 'done' ? 'text-success' : ''}
                          ${task.status === 'in-progress' ? 'text-info' : ''}
                          ${task.status === 'todo' ? 'text-muted-foreground' : ''}
                          hover:text-primary
                        `}
                      >
                        <StatusIcon className="w-5 h-5" />
                      </button>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3
                            className={`font-semibold text-foreground ${
                              task.status === 'done' ? 'line-through text-muted-foreground' : ''
                            }`}
                          >
                            {task.title}
                          </h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEditTask(task)}
                                className="gap-2"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteTask(task.id)}
                                className="gap-2 text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 mt-3 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`
                              ${task.priority === 'high' ? 'priority-high' : ''}
                              ${task.priority === 'medium' ? 'priority-medium' : ''}
                              ${task.priority === 'low' ? 'priority-low' : ''}
                            `}
                          >
                            {task.priority}
                          </Badge>

                          {task.dueDate && (
                            <div
                              className={`flex items-center gap-1 text-xs ${
                                isOverdue ? 'text-destructive' : 'text-muted-foreground'
                              }`}
                            >
                              <Calendar className="w-3 h-3" />
                              {new Date(task.dueDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                          )}

                          {task.estimatedTime && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {Math.floor(task.estimatedTime / 60)}h {task.estimatedTime % 60}m
                            </div>
                          )}

                          {task.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredAndSortedTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tasks found</p>
            <Button onClick={handleCreateTask} variant="outline" className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Create your first task
            </Button>
          </div>
        )}
      </div>

      <TaskFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        task={editingTask}
      />
    </motion.div>
  );
};

export default TaskList;
