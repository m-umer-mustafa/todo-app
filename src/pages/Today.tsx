import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import TaskList from "@/components/TaskList";
import { useTaskStore } from "@/stores/useTaskStore";
import { useState, useEffect } from "react";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { EditTaskDialog } from "@/components/EditTaskDialog";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: Date;
  createdAt: Date;
}

export default function Today() {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { getTodayTasks, toggleTask, deleteTask, tasks } = useTaskStore();
  const [displayedTasks, setDisplayedTasks] = useState(getTodayTasks());

  useEffect(() => {
    setDisplayedTasks(getTodayTasks());
  }, [tasks]);

  useEffect(() => {
    const onSearch = (e: Event) => {
      const { results } = (e as CustomEvent<{ results: Task[] | null }>).detail;
      setDisplayedTasks(results ?? getTodayTasks());
    };
    window.addEventListener("taskSearch", onSearch);
    return () => window.removeEventListener("taskSearch", onSearch);
  }, [tasks]);

  const handleEditTask = (taskId: string) => {
    const taskToEdit = displayedTasks.find(t => t.id === taskId);
    if (taskToEdit) {
      setSelectedTask(taskToEdit);
      setIsEditTaskOpen(true);
    }
  };

  return (
    <div className="space-y-6 flex-1 relative overflow-y-auto">
      <h1 className="text-2xl font-bold">Today's Tasks</h1>
      {displayedTasks.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">No tasks planned for today</p>
          <Button onClick={() => setIsAddTaskOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      ) : (
        <div className="max-h-[calc(100vh-5rem)] space-y-4 flex-1 relative overflow-y-auto kimi-scrollbar">
          <TaskList
            tasks={displayedTasks}
            onToggleComplete={toggleTask}
            onEditTask={handleEditTask}
            onDeleteTask={deleteTask}
          />
        </div>
      )}
      <AddTaskDialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen} />
      {selectedTask && (
        <EditTaskDialog
          open={isEditTaskOpen}
          onOpenChange={(open) => {
            setIsEditTaskOpen(open);
            if (!open) setSelectedTask(null);
          }}
          task={selectedTask}
        />
      )}
    </div>
  );
}
