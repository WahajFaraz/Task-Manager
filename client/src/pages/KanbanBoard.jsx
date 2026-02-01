import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTask } from '@/context/TaskContext';
import TaskFormDialog from '@/components/TaskFormDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Calendar,
  Clock,
  Tag,
  MoreHorizontal,
  Edit,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';

const SortableTask = ({ task, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isOverdue = (dueDate) => {
    return dueDate && new Date(dueDate) < new Date();
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-3">
      <Card className="cursor-move hover:shadow-md transition-shadow" {...attributes} {...listeners}>
        <CardContent className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{task.title}</h4>
              {task.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
              
              {/* Tags */}
              {task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {task.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                  {task.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{task.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            {/* Priority */}
            <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </Badge>

            {/* Due Date */}
            {task.dueDate && (
              <div className={`flex items-center gap-1 ${isOverdue(task.dueDate) ? 'text-red-600' : ''}`}>
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
              <div className="flex items-center gap-1 text-red-600">
                <AlertCircle className="h-3 w-3" />
                <span>Overdue</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const KanbanColumn = ({ title, status, tasks, onAddTask, onEditTask, onDeleteTask }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'border-gray-200 bg-gray-50';
      case 'in-progress': return 'border-blue-200 bg-blue-50';
      case 'done': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'todo': return '📋';
      case 'in-progress': return '⚡';
      case 'done': return '✅';
      default: return '📋';
    }
  };

  return (
    <div className={`flex-1 min-w-0 rounded-lg border-2 border-dashed ${getStatusColor(status)} p-4`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getStatusIcon(status)}</span>
          <h3 className="font-semibold">{title}</h3>
          <Badge variant="secondary" className="text-xs">
            {tasks.length}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddTask(status)}
          className="h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2 min-h-[200px]">
        {tasks.map((task) => (
          <SortableTask
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p className="text-sm">No tasks in this column</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddTask(status)}
              className="mt-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const KanbanBoard = () => {
  const { tasks, updateTask, deleteTask, isLoading } = useTask();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskStatus, setNewTaskStatus] = useState('todo');
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group tasks by status
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    // Check if dropped on a column
    const targetColumn = columns.find((col) => col.id === over.id);
    if (targetColumn && activeTask.status !== targetColumn.id) {
      try {
        await updateTask(activeTask.id, { status: targetColumn.id });
      } catch (error) {
        }
      return;
    }

    // Check if dropped on another task
    const overTask = tasks.find((t) => t.id === over.id);
    if (overTask && activeTask.status !== overTask.status) {
      try {
        await updateTask(activeTask.id, { status: overTask.status });
      } catch (error) {
        }
    }

    setActiveId(null);
  };

  const handleAddTask = (status) => {
    setNewTaskStatus(status);
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTaskStatus(task.status);
    setIsFormOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        }
    }
  };

  const columns = [
    { id: 'todo', title: 'To Do', tasks: todoTasks },
    { id: 'in-progress', title: 'In Progress', tasks: inProgressTasks },
    { id: 'done', title: 'Done', tasks: doneTasks },
  ];

  const activeTask = tasks.find((t) => t.id === activeId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kanban Board</h1>
          <p className="text-muted-foreground">
            Drag and drop tasks to update their status
          </p>
        </div>
        <Button onClick={() => handleAddTask('todo')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <SortableContext
              key={column.id}
              items={column.tasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                key={column.id}
                title={column.title}
                status={column.id}
                tasks={column.tasks}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            </SortableContext>
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="rotate-6 transform">
              <Card className="shadow-2xl">
                <CardContent className="p-3">
                  <h4 className="font-medium text-sm">{activeTask.title}</h4>
                  {activeTask.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {activeTask.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Form Dialog */}
      <TaskFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        task={editingTask}
        defaultStatus={newTaskStatus}
      />
    </div>
  );
};

export default KanbanBoard;
