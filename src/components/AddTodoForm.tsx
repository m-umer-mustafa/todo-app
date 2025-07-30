import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, Calendar } from 'lucide-react';
import { CreateTodoData } from '@/types/todo';

interface AddTodoFormProps {
  onAdd: (data: CreateTodoData) => void;
}

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setDueDate('');
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setIsExpanded(false);
  };

  return (
    <Card className="p-4 shadow-soft border-border/50 bg-card/50 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 border-border/50 focus:border-primary"
            onFocus={() => setIsExpanded(true)}
          />
          <Button 
            type="submit" 
            disabled={!title.trim()}
            className="bg-gradient-primary shadow-soft hover:shadow-medium transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {isExpanded && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)..."
              className="min-h-[80px] border-border/50 focus:border-primary resize-none"
            />
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="flex-1 border-border/50 focus:border-primary"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="border-border/50"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={!title.trim()}
                className="bg-gradient-primary shadow-soft"
              >
                Add Task
              </Button>
            </div>
          </div>
        )}
      </form>
    </Card>
  );
}