'use client';

import { useEffect, useState } from 'react';
import { getTodoListWithTodos } from '../data-access/get-todo-list-with-todos';
import CreateNewTodoForm from '../components/create-new-todo-form';

interface Todo {
  id: string;
  name: string;
  completed: boolean;
  priority: number;
  dueDate: Date | null;
  tags: string[];
  todoListId: string;
}

interface TodoList {
  id: string;
  name: string;
  todos: Todo[];
}

interface TodoPageProps {
  params: { todo: string };
}

const TodoPage = ({ params }: TodoPageProps) => {
  const { todo } = params;
  const [todoList, setTodoList] = useState<TodoList | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTodoList = async () => {
    try {
      const todoListData = await getTodoListWithTodos(todo);
      if (todoListData) {
        setTodoList(todoListData);
      } else {
        setError('Todo List not found.');
      }
    } catch (err) {
      setError('Failed to fetch todo list.');
    }
  };

  useEffect(() => {
    fetchTodoList();
  }, [todo]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!todoList) {
    return <p>Loading...</p>;
  }

  return (
    <div className='flex flex-col w-full max-w-7xl mx-auto gap-10 mt-10'>
      <h1>Todo List: {todoList.name}</h1>
      <ul>
        {todoList.todos.map((todo) => (
          <li key={todo.id}>
            <strong>{todo.name}</strong> -{' '}
            {todo.completed ? 'Completed' : 'Not Completed'} - Priority:{' '}
            {todo.priority} - Due Date:{' '}
            {todo.dueDate
              ? new Date(todo.dueDate).toLocaleDateString('en-GB')
              : 'No due date'}{' '}
            - Tags: {todo.tags.join(', ')}
          </li>
        ))}
      </ul>
      <CreateNewTodoForm
        todoListId={todoList.id}
        onTodoCreated={fetchTodoList}
      />
    </div>
  );
};

export default TodoPage;
