export interface Todo {
  id: string;
  name: string;
  completed: boolean;
  priority: number;
  dueDate: Date | null;
  tags: string[];
  todoListId: string;
}

export interface TodoList {
  id: string;
  name: string;
  todos: Todo[];
}
