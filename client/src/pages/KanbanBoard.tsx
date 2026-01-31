import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTask } from '@/context/TaskContext';
import { Task, TaskStatus } from '@/types/task';
import TaskCard from '@/components/TaskCard';
import TaskFormDialog from '@/components/TaskFormDialog';
import { Button } from '@/components/ui/button';
import { Plus, CircleDot, Timer, CheckCircle2 } from 'lucide-react';

interface Column {
  id: TaskStatus;
  title: string;
  icon: React.ElementType;
  className: string;
}

const columns: Column[] = [
  { id: 'todo', title: 'To Do', icon: CircleDot, className: 'kanban-todo' },
  { id: 'in-progress', title: 'In Progress', icon: Timer, className: 'kanban-progress' },
  { id: 'done', title: 'Done', icon: CheckCircle2, className: 'kanban-done' },
];

interface SortableTaskProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const SortableTask: React.FC<SortableTaskProps> = ({ task, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} isDragging={isDragging} />
    </div>
  );
};

const KanbanBoard: React.FC = () => {
  const { tasks, moveTask, deleteTask } = useTask();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('todo');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    // Check if dropped on a column
    const targetColumn = columns.find((col) => col.id === over.id);
    if (targetColumn && activeTask.status !== targetColumn.id) {
      moveTask(activeTask.id, targetColumn.id);
      return;
    }

    // Check if dropped on another task
    const overTask = tasks.find((t) => t.id === over.id);
    if (overTask && activeTask.status !== overTask.status) {
      moveTask(activeTask.id, overTask.status);
    }
  };

  const handleAddTask = (status: TaskStatus) => {
    setNewTaskStatus(status);
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    console.log('KanbanBoard: Editing task:', task);
    setEditingTask(task);
    setNewTaskStatus(task.status);
    setIsFormOpen(true);
  };

  return (
    <motion.div
      className="page-transition"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Kanban Board</h1>
        <p className="text-muted-foreground mt-1">
          Drag and drop tasks between columns to update their status
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);
            return (
              <div key={column.id} className={`kanban-column ${column.className}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <column.icon className="w-5 h-5 text-muted-foreground" />
                    <h2 className="font-semibold text-foreground">{column.title}</h2>
                    <span className="text-sm text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleAddTask(column.id)}
                    className="h-8 w-8"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <SortableContext
                  items={columnTasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3 min-h-[200px]">
                    <AnimatePresence>
                      {columnTasks.map((task) => (
                        <SortableTask
                          key={task.id}
                          task={task}
                          onEdit={handleEditTask}
                          onDelete={deleteTask}
                        />
                      ))}
                    </AnimatePresence>
                    {columnTasks.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <p className="text-sm">No tasks</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddTask(column.id)}
                          className="mt-2"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add task
                        </Button>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} isDragging />}
        </DragOverlay>
      </DndContext>

      <TaskFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        task={editingTask}
        defaultStatus={newTaskStatus}
      />
    </motion.div>
  );
};

export default KanbanBoard;
