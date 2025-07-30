import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useTaskStore } from '@/stores/useTaskStore';

interface Task {
  id: string;
  title: string;
  description?: string;
  categoryId?: string;
  completed: boolean;
  dueDate: Date;
  createdAt: Date;
}

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task; // Added question mark to indicate it's optional
}

export function EditTaskDialog({ open, onOpenChange, task }: EditTaskDialogProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [date, setDate] = useState(task?.dueDate ?? new Date());
  const [category, setCategory] = useState(task?.categoryId ?? "");
  const { categories, addCategory } = useCategoryStore();
  const { updateTask } = useTaskStore();

  useEffect(() => {
    if (open && task) { // Check if task is not null before accessing its properties
      setTitle(task.title);
      setDescription(task.description ?? "");
      setDate(task.dueDate);
      setCategory(task.categoryId || "");
    }
  }, [open, task]);

  const handleSubmit = () => {
    if (!title || !date) return;

    updateTask(task?.id, { // Safely access id if task is not null
      title,
      description,
      dueDate: date,
      categoryId: category || "uncategorized",
      completed: task?.completed ?? false, // Provide default value if task is null
    });

    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setDate(task?.dueDate ?? new Date());
    setCategory(task?.categoryId ?? "");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select due date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
            </Popover>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="w-full" onClick={handleSubmit}>
            Update Task
          </Button>
          <Button className="w-full" variant="secondary" onClick={resetForm}>
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditTaskDialog;