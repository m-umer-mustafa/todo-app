import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Task {
  id: string;
  title: string;
  description?: string;
  categoryId?: string;
  color?: string;  // added color property
  completed: boolean;
  dueDate: Date;
  createdAt: Date;
}

interface TaskStore {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  filterTasks: (query: string) => Task[];
  filterByDate: (date: string) => Task[]; 
  filterByColor: (color: string) => Task[]; 
  filterByCategory: (categoryId: string) => Task[];
  getAllTasks: () => Task[];
  getPendingTasks: () => Task[];
  getOverdueTasks: () => Task[];
  getTodayTasks: () => Task[];
  getUpcomingTasks: () => Task[];
  getCompletedTasks: () => Task[];
  searchTodos: (tasks: Task[], query: string) => Task[];
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: crypto.randomUUID(),
              createdAt: new Date(),
            },
          ],
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      updateTask: (id, updates) => {
        const updatedTasks = get().tasks.map((task) =>
          task.id === id ? { ...task, ...updates } : task
        );
        set({ tasks: updatedTasks });
      },
      filterTasks: (query) => {
        const tasks = get().tasks;
        return tasks.filter((task) =>
          task.title.toLowerCase().includes(query.toLowerCase())
        );
      },

      // New filter functions:
      filterByDate: (date) => {
        if (!date) return get().tasks;
        return get().tasks.filter(
          (task) => task.dueDate.toISOString().slice(0, 10) === date
        );
      },

      filterByColor: (color) => {
        if (!color) return get().tasks;
        return get().tasks.filter((task) => task.color === color);
      },

      filterByCategory: (categoryId) => {
        if (!categoryId) return get().tasks;
        return get().tasks.filter((task) => task.categoryId === categoryId);
      },

      getAllTasks: () => {
        return get().tasks;
      },
      getPendingTasks: () => {
        const tasks = get().tasks;
        return tasks.filter((t) => !t.completed);
      },
      getOverdueTasks: () => {
        const tasks = get().tasks;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return tasks.filter(
          (task) => !task.completed && task.dueDate < today
        );
      },
      getTodayTasks: () => {
        const tasks = get().tasks;
        const today = new Date();
        return tasks.filter(
          (task) =>
            !task.completed &&
            task.dueDate.toDateString() === today.toDateString()
        );
      },
      getUpcomingTasks: () => {
        const tasks = get().tasks;
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        return tasks.filter(
          (task) =>
            !task.completed &&
            task.dueDate > today &&
            task.dueDate <= nextWeek
        );
      },
      getCompletedTasks: () => {
        const tasks = get().tasks;
        return tasks.filter((task) => task.completed);
      },
      searchTodos: (tasks, query) => {
        if (!query.trim()) return tasks;
        const searchTerm = query.toLowerCase().trim();
        return tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(searchTerm) ||
            task.description?.toLowerCase().includes(searchTerm)
        );
      },
    }),
    {
      name: 'task-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          parsed.state.tasks.forEach((t: any) => {
            if (t.dueDate) t.dueDate = new Date(t.dueDate);
            if (t.createdAt) t.createdAt = new Date(t.createdAt);
          });
          return parsed;
        },
        setItem: (name, value) =>
          localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
