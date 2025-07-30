// src/hooks/useTodos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: Date;
  categoryId?: string;
}

/* ---------- helpers ---------- */
const todoFromJSON = (raw: any): Todo => ({
  ...raw,
  dueDate: raw.dueDate ? new Date(raw.dueDate) : undefined,
});

const todoToJSON = (t: Todo): any => ({
  ...t,
  dueDate: t.dueDate?.toISOString(),
});

/* ---------------------------- */
export const useTodos = () => {
  const queryClient = useQueryClient();

  /* ---------- READ ---------- */
  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: () => {
      const stored = localStorage.getItem('todos');
      return stored ? JSON.parse(stored).map(todoFromJSON) : [];
    },
  });

  /* ---------- WRITE helper ---------- */
  const write = (list: Todo[]) =>
    localStorage.setItem('todos', JSON.stringify(list.map(todoToJSON)));

  /* ---------- MUTATIONS ---------- */
  const addTodoMutation = useMutation({
    mutationFn: (newTodo: Omit<Todo, 'id' | 'completed'>) =>
      Promise.resolve({
        ...newTodo,
        id: crypto.randomUUID(),
        completed: false,
      }).then(todo => {
        write([...todos, todo]);
        return todo;
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const toggleTodoMutation = useMutation({
    mutationFn: (id: string) =>
      Promise.resolve(
        todos.map(t =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      ).then(next => {
        write(next);
        return id;
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const deleteTodoMutation = useMutation({
    mutationFn: (id: string) =>
      Promise.resolve(
        todos.filter(t => t.id !== id)
      ).then(next => {
        write(next);
        return id;
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const updateTodoMutation = useMutation({
    mutationFn: (updated: Todo) =>
      Promise.resolve(
        todos.map(t => (t.id === updated.id ? updated : t))
      ).then(next => {
        write(next);
        return updated;
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  /* ---------- RETURN ---------- */
  const completedTodos = todos.filter(t => t.completed);
  const pendingTodos   = todos.filter(t => !t.completed);

  const filterTodosByDate = (todos: Todo[], date: Date | undefined) => {
    if (!date) return todos;
    return todos.filter((todo) => {
      const todoDate = new Date(todo.dueDate);
      return (
        todoDate.getFullYear() === date.getFullYear() &&
        todoDate.getMonth() === date.getMonth() &&
        todoDate.getDate() === date.getDate()
      );
    });
  };

  const searchTodos = (todos: Todo[], query: string) => {
    if (!query) return todos;
    const lowercaseQuery = query.toLowerCase();
    return todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(lowercaseQuery) ||
        todo.description?.toLowerCase().includes(lowercaseQuery)
    );
  };

  return {
    todos,
    completedTodos,
    pendingTodos,
    isLoading,
    addTodo: addTodoMutation.mutate,
    toggleTodo: toggleTodoMutation.mutate,
    deleteTodo: deleteTodoMutation.mutate,
    updateTodo: updateTodoMutation.mutate,
    filterTodosByDate,
    searchTodos,
  };
};