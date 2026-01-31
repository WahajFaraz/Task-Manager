import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTask } from '@/context/TaskContext';
import { Task } from '@/types/task';
import TaskFormDialog from '@/components/TaskFormDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Tag,
  Move,
} from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CalendarView: React.FC = () => {
  const { tasks, getTasksByDate, updateTask } = useTask();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayIndex = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDateString = (date: Date | number) => {
    if (typeof date === 'number') {
      return `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    }
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getTasksForDay = (day: number): Task[] => {
    const dateString = getDateString(day);
    return getTasksByDate(dateString);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const handleDateClick = (day: number) => {
    const dateString = getDateString(day);
    setSelectedDate(selectedDate === dateString ? null : dateString);
  };

  const selectedDateTasks = selectedDate ? getTasksByDate(selectedDate) : [];

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, day: Date) => {
    e.preventDefault();
    if (!draggedTask) return;

    console.log('CalendarView: Dropping task:', draggedTask.id, 'to date:', day);
    
    const newDateString = getDateString(day);
    const newDueDate = new Date(newDateString).toISOString();
    
    updateTask(draggedTask.id, { dueDate: newDueDate });
    setDraggedTask(null);
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayIndex; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 md:h-32 bg-muted/20 rounded-lg" />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = getDateString(day);
      const dayTasks = getTasksForDay(day);
      const isSelected = selectedDate === dateString;
      const isTodayDate = isToday(day);

      days.push(
        <motion.button
          key={day}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleDateClick(day)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, day)}
          className={`
            h-24 md:h-32 p-2 rounded-lg text-left transition-all
            ${isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'}
            ${isTodayDate ? 'bg-primary/10' : 'bg-card'}
            ${draggedTask ? 'border-2 border-dashed border-primary bg-primary/5' : 'border border-border/50'}
          `}
        >
          <div className="flex items-center justify-between">
            <span
              className={`
                text-sm font-medium
                ${isTodayDate ? 'text-primary' : 'text-foreground'}
                ${isTodayDate ? 'bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center' : ''}
              `}
            >
              {day}
            </span>
            {dayTasks.length > 0 && (
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {dayTasks.length}
              </span>
            )}
          </div>
          <div className="mt-1 space-y-1 overflow-hidden">
            {dayTasks.slice(0, 2).map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={() => handleDragStart(task)}
                className={`
                  text-xs truncate px-1.5 py-0.5 rounded cursor-move
                  ${task.status === 'done' ? 'bg-success/10 text-success' : ''}
                  ${task.status === 'in-progress' ? 'bg-info/10 text-info' : ''}
                  ${task.status === 'todo' ? 'bg-muted text-muted-foreground' : ''}
                  hover:opacity-80 transition-opacity
                `}
                title="Drag to move to another date"
              >
                {task.title}
              </div>
            ))}
            {dayTasks.length > 2 && (
              <div className="text-xs text-muted-foreground px-1.5">
                +{dayTasks.length - 2} more
              </div>
            )}
          </div>
        </motion.button>
      );
    }

    return days;
  };

  return (
    <motion.div
      className="page-transition"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
            <p className="text-muted-foreground mt-1">
              View and manage tasks by date. Drag tasks to move them to different dates.
            </p>
          </div>

          {/* Calendar Header */}
          <Card className="border-border/50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <h2 className="text-xl font-semibold text-foreground ml-2">
                    {MONTHS[month]} {year}
                  </h2>
                </div>
                <Button variant="outline" onClick={goToToday}>
                  Today
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Calendar Grid */}
          <Card className="border-border/50">
            <CardContent className="p-4">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-muted-foreground py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {renderCalendarDays()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Panel */}
        <AnimatePresence mode="wait">
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full lg:w-80"
            >
              <Card className="border-border/50 sticky top-24">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">
                      {new Date(selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </h3>
                  </div>

                  {selectedDateTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No tasks scheduled for this day
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedDateTasks.map((task) => (
                        <motion.button
                          key={task.id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleEditTask(task)}
                          draggable
                          onDragStart={() => handleDragStart(task)}
                          className="w-full text-left p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-move"
                          title="Drag to move to another date"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Move className="w-3 h-3 text-muted-foreground" />
                            <h4 className="font-medium text-foreground">{task.title}</h4>
                          </div>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
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
                            <Badge
                              variant="secondary"
                              className={`
                                ${task.status === 'done' ? 'badge-done' : ''}
                                ${task.status === 'in-progress' ? 'badge-progress' : ''}
                                ${task.status === 'todo' ? 'badge-todo' : ''}
                              `}
                            >
                              {task.status}
                            </Badge>
                          </div>
                          {task.estimatedTime && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {Math.floor(task.estimatedTime / 60)}h {task.estimatedTime % 60}m
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <TaskFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        task={editingTask}
      />
    </motion.div>
  );
};

export default CalendarView;
