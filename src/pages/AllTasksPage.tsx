import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { EditTaskDialog } from "@/components/EditTaskDialog";
import TaskList from "@/components/TaskList";
import { useTaskStore } from "@/stores/useTaskStore";
import { useCategoryStore } from "@/stores/useCategoryStore";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: Date;
  createdAt: Date;
  categoryId?: string;  // ensure categoryId matches store property
  color?: string;
}

const CATEGORY_COLORS = [
  { label: "Red", value: "#ef4444" },
  { label: "Orange", value: "#f97316" },
  { label: "Yellow", value: "#eab308" },
  { label: "Green", value: "#22c55e" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Purple", value: "#a855f7" },
  { label: "Pink", value: "#ec4899" },
];

export default function AllTasksPage() {
  const { categories } = useCategoryStore();
  const {
    getPendingTasks,
    getCompletedTasks,
    toggleTask,
    deleteTask,
    tasks,
    filterByDate,
    filterByColor,
    filterByCategory,
  } = useTaskStore();

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const allTasks = [...getPendingTasks(), ...getCompletedTasks()];
  const [displayedTasks, setDisplayedTasks] = useState<Task[]>(allTasks);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    // Compose filters using the store's filter methods
    let filtered = [...allTasks];

    if (selectedCategory) {
      filtered = filterByCategory(selectedCategory);
    }

    if (selectedDate) {
      filtered = filterByDate(selectedDate).filter(t => filtered.includes(t));
    }

    if (selectedColor) {
      // Convert selectedColor label to hex value
      const colorHex = CATEGORY_COLORS.find(c => c.label === selectedColor)?.value;
      if (colorHex) {
        filtered = filterByColor(colorHex).filter(t => filtered.includes(t));
      }
    }

    setDisplayedTasks(filtered);
  }, [selectedCategory, selectedDate, selectedColor, tasks]);

  useEffect(() => {
    setDisplayedTasks(allTasks);
  }, [tasks]);

  useEffect(() => {
    const onSearch = (e: Event) => {
      const { results } = (e as CustomEvent<{ results: Task[] | null }>).detail;
      setDisplayedTasks(results ?? allTasks);
    };
    window.addEventListener("taskSearch", onSearch);
    return () => window.removeEventListener("taskSearch", onSearch);
  }, [tasks]);

  const handleEditTask = (taskId: string) => {
    const taskToEdit = displayedTasks.find((t) => t.id === taskId);
    if (taskToEdit) {
      setSelectedTask(taskToEdit);
      setIsEditTaskOpen(true);
    }
  };

  return (
    <div className="space-y-6 relative overflow-y-auto">
      <h1 className="text-2xl font-bold">All Tasks</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-box"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Due Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="filter-box"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Color</label>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="filter-box"
          >
            <option value="">All Colors</option>
            {CATEGORY_COLORS.map((color) => (
              <option key={color.label} value={color.label}>
                {color.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List */}
      {displayedTasks.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">No tasks found</p>
          <Button onClick={() => setIsAddTaskOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      ) : (
        <div className="max-h-[calc(100vh-5rem)] space-y-6 flex-1 relative overflow-y-auto kimi-scrollbar">
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
