import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTask } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MoreHorizontal,
  Edit,
  Trash2,
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
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

const CalendarView = () => {
  const { tasks, updateTask, deleteTask, isLoading } = useTask();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Get tasks for a specific date
  const getTasksForDate = (day) => {
    if (!day) return [];
    
    const date = new Date(currentYear, currentMonth, day);
    const dateString = getDateString(date);
    
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return getDateString(taskDate) === dateString;
    });
  };

  // Format date string for comparison
  const getDateString = (date) => {
    if (typeof date === 'number') {
      // Handle the case where date is a number (day of month)
      const d = new Date(currentYear, currentMonth, date);
      return d.toISOString().split('T')[0];
    }
    return date.toISOString().split('T')[0];
  };

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1));
  };

  // Handle drag start
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // Handle drag end
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    const draggedTask = tasks.find((t) => t.id === active.id);
    if (!draggedTask) return;

    // Get the target date from the droppable area
    const targetDate = over.data.current?.date;
    if (targetDate) {
      try {
        const newDueDate = getDateString(targetDate);
          await updateTask(draggedTask.id, { dueDate: newDueDate });
      } catch (error) {
        }
    }

    setActiveId(null);
  };

  // Handle adding task for a specific date
  const handleAddTask = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    setSelectedDate(date);
    setEditingTask(null);
    setIsFormOpen(true);
  };

  // Handle editing task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setSelectedDate(null);
    setIsFormOpen(true);
  };

  // Handle deleting task
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Check if task is overdue
  const isOverdue = (dueDate) => {
    return dueDate && new Date(dueDate) < new Date();
  };

  // Get active task for drag overlay
  const activeTask = tasks.find((t) => t.id === activeId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const monthYearString = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar View</h1>
          <p className="text-muted-foreground">
            View and manage your tasks by due date
          </p>
        </div>
        <Button onClick={() => handleAddTask(new Date().getDate())}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-xl">{monthYearString}</CardTitle>
            <Button variant="outline" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-sm p-2">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((day, index) => {
              const dayTasks = day ? getTasksForDate(day) : [];
              const isToday = day === new Date().getDate() && 
                             currentMonth === new Date().getMonth() && 
                             currentYear === new Date().getFullYear();
              
              return (
                <DndContext
                  key={index}
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <div
                    className={`
                      min-h-[100px] border rounded-lg p-2
                      ${day ? 'bg-white hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'}
                      ${isToday ? 'ring-2 ring-blue-500' : ''}
                    `}
                    onClick={() => day && handleAddTask(day)}
                  >
                    {day && (
                      <>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : ''}`}>
                            {day}
                          </span>
                          {dayTasks.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {dayTasks.length}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Tasks for this day */}
                        <div className="space-y-1">
                          {dayTasks.slice(0, 3).map((task) => (
                            <div
                              key={task.id}
                              className="text-xs p-1 bg-gray-100 rounded cursor-move hover:bg-gray-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTask(task);
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="truncate font-medium">{task.title}</span>
                                <div className="flex items-center gap-1">
                                  {isOverdue(task.dueDate) && (
                                    <AlertCircle className="h-3 w-3 text-red-500" />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {dayTasks.length > 3 && (
                            <div className="text-xs text-muted-foreground text-center">
                              +{dayTasks.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </DndContext>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Task Form Dialog */}
      <TaskFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        task={editingTask}
        onTaskCreated={() => {
          setIsFormOpen(false);
          setEditingTask(null);
          setSelectedDate(null);
        }}
      />

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <Card className="shadow-2xl">
            <CardContent className="p-3">
              <h4 className="font-medium text-sm">{activeTask.title}</h4>
              {activeTask.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {activeTask.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Badge className={`text-xs ${getPriorityColor(activeTask.priority)}`}>
                  {activeTask.priority}
                </Badge>
                {activeTask.dueDate && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarIcon className="h-3 w-3" />
                    {new Date(activeTask.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </DragOverlay>
    </div>
  );
};

export default CalendarView;
