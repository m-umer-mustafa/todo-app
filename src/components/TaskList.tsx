import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CalendarDays, Trash2, Pencil, Tag } from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: Date;
  createdAt: Date;
  category?: string; 
  color?: string;  
}

interface TaskListProps {
  tasks: Task[];
  onToggleComplete?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onEditTask?: (taskId: string) => void;
}

export default function TaskList({
  tasks,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
}: TaskListProps) {
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);

  return (
    <div className="space-y-4 flex-1 relative overflow-y-auto kimi-scrollbar max-h-full
        px-6 py-4 mx-6 my-4 rounded-3xl bg-white/20 dark:bg-black/20
        backdrop-blur-md bg-clip-padding">
      {tasks.map((task) => (
        <Card
          key={task.id}
          className="relative"
          onMouseEnter={() => setHoveredTaskId(task.id)}
          onMouseLeave={() => setHoveredTaskId(null)}
        >
          <CardHeader className="p-4 pb-2">
            <div className="flex items-start gap-2 ">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => onToggleComplete?.(task.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <CardTitle
                  className={
                    task.completed ? "line-through text-muted-foreground" : ""
                  }
                >
                  {task.title}
                </CardTitle>
                {task.description && (
                  <CardDescription className="mt-1">
                    {task.description}
                  </CardDescription>
                )}
                <CardDescription className="mt-2 flex items-center text-sm text-muted-foreground">
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {task.color && (
                      <div className="flex items-center">
                        <span
                          className="inline-block w-4 h-4 rounded-full mr-2 border"
                          style={{ backgroundColor: task.color }}
                          aria-label="Task color"
                        />
                      </div>
                    )}
                    {task.category && (
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-1" />
                        {task.category}
                      </div>
                    )}
                  </div>
                </CardDescription>
                
              </div>

              <div className="absolute right-2 top-2 flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditTask?.(task.id)}
                >
                  <Pencil className="h-4 w-4 text-primary" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteTask?.(task.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="mr-2 h-4 w-4" />
              {format(task.dueDate, "PPP")}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
