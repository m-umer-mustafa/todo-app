import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  HomeIcon,
  ListTodo,
  PlusCircle,
  Search,
  Star,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useTaskStore } from "@/stores/useTaskStore";
import { Header } from "./Header";
import { useTheme } from "@/components/ThemeProvider";
import { AddTaskDialog } from "@/components/AddTaskDialog";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const { setTheme, theme } = useTheme();
  const location = useLocation();
  const { getPendingTasks, getTodayTasks, getUpcomingTasks, getCompletedTasks, searchTodos } =
    useTaskStore();

  interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    dueDate: Date;
    createdAt: Date;
  }

  const sidebarItems = [
    { icon: HomeIcon, label: "Home", path: "/" },
    { icon: ListTodo, label: "All Tasks", path: "/all-tasks" },
    { icon: Star, label: "Today", path: "/today" },
    { icon: Calendar, label: "Upcoming", path: "/upcoming" },
    { icon: ListTodo, label: "Completed", path: "/completed" },
    { icon: AlertCircle, label: "Overdue", path: "/overdue" },
  ];

  const getFilteredTasks = (query: string) => {
    let tasksToSearch: Task[] = [];
    switch (location.pathname) {
      case "/":
        tasksToSearch = getPendingTasks();
        break;
      case "/today":
        tasksToSearch = getTodayTasks();
        break;
      case "/upcoming":
        tasksToSearch = getUpcomingTasks();
        break;
      case "/completed":
        tasksToSearch = getCompletedTasks();
        break;
      default:
        tasksToSearch = getPendingTasks();
    }
    return searchTodos(tasksToSearch, query);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
    const filteredTasks = getFilteredTasks(query);
    const searchEvent = new CustomEvent("taskSearch", {
      detail: { results: query ? filteredTasks : null },
    });
    window.dispatchEvent(searchEvent);
  };

  useEffect(() => {
    if (!isSearchOpen) {
      setSearch("");
      const searchEvent = new CustomEvent("taskSearch", {
        detail: { results: null },
      });
      window.dispatchEvent(searchEvent);
    }
  }, [isSearchOpen]);

  return (
    <div
      className={`flex flex-col h-screen overflow-hidden text-foreground transition-background duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-b from-[#1e002f] via-[#2a003d] to-[#1e002f]"
          : "bg-gradient-to-b from-green-100 via-white to-zinc-100"
      }`}
    >
      {/* Header (assumed to have blur & transparency) */}
      <Header
        search={search}
        onSearchChange={handleSearch}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        theme={theme}
        toggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
      />

      <div className="flex flex-1 overflow-hidden px-6 pb-6">
        {/* Sidebar */}
        <aside
          className="border rounded-3xl p-6 mr-6 mt-2 flex flex-col kimi-scrollbar bg-white/10 dark:bg-black/10 backdrop-blur-md shadow-md"
          style={{
            minWidth: "12rem",
            maxWidth: "18rem",
            maxHeight: "calc(100vh - 112px)",
          }}
        >
          <Button
            className="w-full mb-4 rounded-xl"
            size="lg"
            onClick={() => setIsAddTaskOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>

          <nav className="space-y-1 mb-4">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start rounded-xl ${
                    isActive && theme !== "dark" ? "sidebar-active-light" : ""
                  }`}
                  asChild
                >
                  <Link to={item.path}>
                    <item.icon
                      className={`mr-2 h-4 w-4 ${
                        isActive && theme === "dark"
                          ? "text-purple-400" // purplish blue icon in dark mode for active
                          : ""
                      }`}
                    />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto kimi-scrollbar p-6 rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur-md shadow-lg">
          {children}
        </main>
      </div>

      <AddTaskDialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen} />
    </div>
  );
};

export default MainLayout;
