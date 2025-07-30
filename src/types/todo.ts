export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
}

export interface CreateTodoData {
  title: string;
  description?: string;
  dueDate?: string;
}