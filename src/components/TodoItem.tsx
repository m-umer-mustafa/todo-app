import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Check, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Calendar,
  Clock
} from 'lucide-react';
import { Todo } from '@/types/todo';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;
  const isDueToday = todo.dueDate && new Date(todo.dueDate).toDateString() === new Date().toDateString();

  const handleSave = () => {
    if (!editTitle.trim()) return;
    
    onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className={cn(
      "p-4 shadow-task border transition-all duration-200 hover:shadow-soft",
      "bg-card/50 backdrop-blur-sm",
      todo.completed && "opacity-75 bg-success-muted/20",
      isOverdue && !todo.completed && "border-destructive/50 bg-destructive-muted/10"
    )}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          className={cn(
            "mt-1 transition-colors duration-200",
            todo.completed && "data-[state=checked]:bg-success data-[state=checked]:border-success"
          )}
        />

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="border-border/50 focus:border-primary"
                autoFocus
              />
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Add a description..."
                className="min-h-[60px] border-border/50 focus:border-primary resize-none"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!editTitle.trim()}
                  className="bg-gradient-success shadow-soft"
                >
                  <Save className="h-3 w-3 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  className="border-border/50"
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className={cn(
                "font-medium text-card-foreground transition-all duration-200",
                todo.completed && "line-through text-task-completed"
              )}>
                {todo.title}
              </h3>
              
              {todo.description && (
                <p className={cn(
                  "text-sm text-muted-foreground",
                  todo.completed && "line-through"
                )}>
                  {todo.description}
                </p>
              )}

              {todo.dueDate && (
                <div className={cn(
                  "flex items-center gap-1 text-xs",
                  isOverdue && !todo.completed && "text-destructive",
                  isDueToday && !todo.completed && "text-warning",
                  todo.completed && "text-task-completed line-through"
                )}>
                  {isDueToday ? (
                    <Clock className="h-3 w-3" />
                  ) : (
                    <Calendar className="h-3 w-3" />
                  )}
                  <span>
                    {isDueToday ? "Due today" : `Due ${formatDate(todo.dueDate)}`}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0 hover:bg-primary-muted"
            >
              <Edit3 className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(todo.id)}
              className="h-8 w-8 p-0 hover:bg-destructive-muted text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}