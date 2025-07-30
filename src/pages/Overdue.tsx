// src/pages/Overdue.tsx
import TaskList from "@/components/TaskList";
import { useTaskStore } from "@/stores/useTaskStore";
import { useEffect, useState } from "react";

export default function Overdue() {
  const { getOverdueTasks, toggleTask, deleteTask } = useTaskStore();
  const [displayedTasks, setDisplayedTasks] = useState(getOverdueTasks());
  const originalTasks = getOverdueTasks();

  interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    dueDate: Date;
    createdAt: Date;
  }

  useEffect(() => {
    const onSearch = (e: Event) => {
      const { results } = (e as CustomEvent<{ results: Task[] | null }>).detail;
      setDisplayedTasks(results ?? originalTasks);
    };
    window.addEventListener("taskSearch", onSearch);
    return () => window.removeEventListener("taskSearch", onSearch);
  }, [originalTasks]);

  return (
    <div className="space-y-6 flex-1 relative overflow-y-auto">
      <h1 className="text-2xl font-bold">Overdue Tasks</h1>
      {displayedTasks.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No overdue tasks</p>
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
