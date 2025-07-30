import { useEffect, useState } from 'react';
import { CheckSquare, Sparkles, PlusCircle, BarChart3, CalendarDays } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTodos } from '@/hooks/useTodos';
import { useTaskStore } from '@/stores/useTaskStore';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { TodoStats } from '@/components/TodoStats';
import { Button } from '@/components/ui/button';
import { EditTaskDialog } from '@/components/EditTaskDialog';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: Date;
  createdAt: Date;
}

const Index = () => {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { tasks, toggleTask, deleteTask } = useTaskStore();
  const { isLoading } = useTodos();
  const { toast } = useToast();

  useEffect(() => {
    const scrollable = document.getElementById('scroll-container');
    if (scrollable) scrollable.scrollTop = 0;
  }, []);

  const handleToggleTodo = (id: string) => {
    const todo = tasks.find(t => t.id === id);
    if (todo) {
      toggleTask(id);
      toast({
        title: todo.completed ? "Task marked as pending" : "Task completed!",
        description: `"${todo.title}" ${todo.completed ? 'is now pending' : 'has been completed'}.`,
      });
    }
  };

  const handleDeleteTodo = (id: string) => {
    const todo = tasks.find(t => t.id === id);
    if (todo) {
      deleteTask(id);
      toast({
        title: "Task deleted",
        description: `"${todo.title}" has been removed from your list.`,
        variant: "destructive",
      });
    }
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsEditTaskOpen(true);
    }
  };

  const stats = {
    totalTodos: tasks.length,
    completedTodos: tasks.filter(t => t.completed).length,
    pendingTodos: tasks.filter(t => !t.completed).length,
    overdueTodos: tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length,
  };

  const dueSoon = tasks
    .filter(t => !t.completed && new Date(t.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const productivityData = [0, 1, 2, 3, 4, 5, 6].map(daysAgo => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const formatted = format(date, 'MMM d');
    const completedToday = tasks.filter(t =>
      t.completed && format(new Date(t.createdAt), 'MMM d') === formatted
    ).length;
    return { day: formatted, completed: completedToday };
  }).reverse();

  return (
    <div className="min-h-screen bg-opacity-0 dark:bg-opacity-0
      flex items-center justify-between
        rounded-3xl border border-border shadow-md sticky top-0 z-20
        bg-white/20 dark:bg-black/20
        backdrop-blur-md
        bg-clip-padding
     overflow-y-auto" id="scroll-container">
      <div className="container max-w-5xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-medium">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome to Todo Web App
            </h1>
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Organize your day, stay on track, and boost your productivity.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <TodoStats {...stats} />
        </div>

        {/* Productivity Chart */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> Your Weekly Productivity
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={productivityData}>
              <XAxis dataKey="day" stroke="#888" />
              <YAxis allowDecimals={false} stroke="#888" />
              <Tooltip />
              <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quote */}
        <div className="text-center py-10">
          <blockquote className="italic text-muted-foreground max-w-xl mx-auto">
            "Success is the sum of small efforts, repeated day in and day out." – Robert Collier
          </blockquote>
        </div>

        {/* Dialogs */}
        <AddTaskDialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen} />
        <EditTaskDialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen} task={selectedTask} />
      </div>
    </div>
  );
};

export default Index;
