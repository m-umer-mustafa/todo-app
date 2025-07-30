import { useState } from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Pencil, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Todo } from '@/types/todo';
import { ListTodo } from "lucide-react";


interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (todo: Todo) => void;
  showEditButton?: boolean;
}

export function TodoList({ todos, onToggle, onDelete, onUpdate, showEditButton = false }: TodoListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-muted/20 flex items-center justify-center">
          <ListTodo className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No tasks yet
        </h3>
        <p className="text-muted-foreground">
          Add your first task above to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <Card
          key={todo.id}
          className="p-4 relative"
          onMouseEnter={() => setHoveredId(todo.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => onToggle(todo.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <h3 className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className="text-sm text-muted-foreground mt-1">{todo.description}</p>
              )}
            </div>
            {hoveredId === todo.id && (
              <div className="flex gap-2">
                {showEditButton && !todo.completed && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onUpdate(todo)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(todo.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}