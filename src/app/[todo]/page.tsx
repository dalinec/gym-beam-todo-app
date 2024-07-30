'use client';

import { CSSProperties, useEffect, useState } from 'react';
import CreateNewTodoForm from '../components/create-new-todo-form';
import TodoItem from '../components/todo-item';
import Link from 'next/link';
import { Todo, TodoList } from '@/types/todos';
import { getTodoListWithTodos } from '../data-access/get-todo-list-with-todos';
import { deleteTodo } from '../data-access/delete-todo';
import { updateTodoCompleted } from '../data-access/todo-completed-state';
import { HashLoader } from 'react-spinners';

interface TodoPageProps {
  params: { todo: string };
}

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
};

const TodoPage = ({ params }: TodoPageProps) => {
  const { todo } = params;
  const [todoList, setTodoList] = useState<TodoList | null>(null);
  const [loadingTodoId, setLoadingTodoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleTodoCreatedOrUpdated = async (todoId?: string) => {
    if (todoId) {
      setLoadingTodoId(todoId);
    }
    await fetchTodoList();
    setLoadingTodoId(null);
    setEditingTodo(null);
  };

  const handleToggleCompleted = async (todoId: string, completed: boolean) => {
    try {
      setLoadingTodoId(todoId);
      await updateTodoCompleted(todoId, completed);
      await fetchTodoList();
    } catch (err) {
      setError('Failed to update todo.');
    } finally {
      setLoadingTodoId(null);
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setIsEditing(true);
  };

  const handleDeleteTodo = async (todoId: string) => {
    try {
      setLoadingTodoId(todoId);
      await deleteTodo(todoId);
      await fetchTodoList();
    } catch (error) {
      setError('Failed to delete todo.');
    } finally {
      setLoadingTodoId(null);
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!todoList) {
    return (
      <div className='min-h-screen w-full flex items-center justify-center'>
        <HashLoader size={60} cssOverride={override} />
      </div>
    );
  }

  return (
    <>
      <h1 className='flex relative p-3 md:p-5 items-center justify-center w-full mt-10 font-bold text-5xl'>
        Todo List: {todoList.name}
        <Link
          href={'/'}
          className='absolute top-0 hidden md:block hover:scale-105 ease-in duration-100 text-lg bg-green-300 px-2 py-1 rounded-lg left-10'
        >
          back
        </Link>
      </h1>
      <Link
        href={'/'}
        className='md:hidden m-3 hover:scale-105 ease-in duration-100 text-lg bg-green-300 px-2 py-1 rounded-lg left-10'
      >
        back
      </Link>
      <div className='flex flex-col md:flex-row w-full max-w-7xl mx-auto gap-10 mt-10 md:mt-16'>
        <CreateNewTodoForm
          todoListId={todoList.id}
          onTodoCreatedOrUpdated={handleTodoCreatedOrUpdated}
          editingTodo={editingTodo}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
        <div className='flex flex-col w-full p-3 md:p-5'>
          {todoList.todos.length === 0 ? (
            <div>No todos listed. </div>
          ) : (
            <ul>
              {todoList.todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggleCompleted={handleToggleCompleted}
                  onDeleteTodo={handleDeleteTodo}
                  onEditTodo={handleEditTodo}
                  isLoading={loadingTodoId === todo.id}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default TodoPage;
