import TaskList from "@/components/TaskList";
import { useTaskStore } from "@/stores/useTaskStore";
import { useEffect, useState } from "react";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: Date;
  createdAt: Date;
}

export default function Completed() {
  const { getCompletedTasks, toggleTask, deleteTask, tasks } = useTaskStore();
  const [displayedTasks, setDisplayedTasks] = useState(getCompletedTasks());

  useEffect(() => {
    setDisplayedTasks(getCompletedTasks());
  }, [tasks]);

  useEffect(() => {
    const onSearch = (e: Event) => {
      const { results } = (e as CustomEvent<{ results: Task[] | null }>).detail;
      setDisplayedTasks(results ?? getCompletedTasks());
    };
    window.addEventListener("taskSearch", onSearch);
    return () => window.removeEventListener("taskSearch", onSearch);
  }, [tasks]);

  return (
    <div className="space-y-6 flex-1 relative overflow-y-auto">
      <h1 className="text-2xl font-bold">Completed Tasks</h1>
      {displayedTasks.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No completed tasks</p>
        </div>
      ) : (
        <div className="max-h-[calc(100vh-5rem)] space-y-4 flex-1 relative overflow-y-auto kimi-scrollbar">
          <TaskList
            tasks={displayedTasks}
            onToggleComplete={toggleTask}
            onDeleteTask={deleteTask}
          />
        </div>
      )}
    </div>
  );
}
