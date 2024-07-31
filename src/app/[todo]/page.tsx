"use client";
import { Todo, TodoList } from "@/types/todos";
import { House, NotepadText, Trash2 } from "lucide-react";
import Link from "next/link";
import { CSSProperties, useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
import CreateNewTodoForm from "../components/create-new-todo-form";
import TodoItem from "../components/todo-item";
import { deleteTodo } from "../data-access/delete-todo";
import { deleteTodoList } from "../data-access/delete-todo-list";
import { getTodoListWithTodos } from "../data-access/get-todo-list-with-todos";
import { updateTodoCompleted } from "../data-access/todo-completed-state";

interface TodoPageProps {
  params: { todo: string };
}

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};

const TodoPage = ({ params }: TodoPageProps) => {
  const { todo } = params;
  const [todoList, setTodoList] = useState<TodoList | null>(null);
  const [loadingTodoId, setLoadingTodoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [formVisible, setFormVisible] = useState<boolean>(true);

  const fetchTodoList = async () => {
    try {
      const todoListData = await getTodoListWithTodos(todo);
      if (todoListData) {
        setTodoList(todoListData);
      } else {
        setError("Todo List not found.");
      }
    } catch (err) {
      setError("Failed to fetch todo list.");
    }
  };

  useEffect(() => {
    fetchTodoList();
  }, [todo]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767) {
        setFormVisible(true);
      }
    };

    window.addEventListener("resize", handleResize);

    if (window.innerWidth > 767) {
      setFormVisible(true);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
      setError("Failed to update todo.");
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
      setError("Failed to delete todo.");
    } finally {
      setLoadingTodoId(null);
    }
  };

  const handleDeleteTodoList = async (todolistId: string) => {
    await deleteTodoList(todolistId);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const handlePriorityFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPriorityFilter(e.target.value);
  };

  const filteredTodos = todoList
    ? todoList.todos
        .filter((todo) => {
          if (filter === "all") return true;
          if (filter === "done") return todo.completed;
          if (filter === "todo") return !todo.completed;
        })
        .filter((todo) => {
          if (priorityFilter === "all") return true;
          return todo.priority === priorityFilter;
        })
    : [];

  const sortedTodos = filteredTodos.sort(
    (a, b) => Number(a.completed) - Number(b.completed),
  );

  if (error) {
    return <p>{error}</p>;
  }

  if (!todoList) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <HashLoader size={60} cssOverride={override} />
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto mt-10 flex w-full max-w-7xl flex-col items-start justify-between md:flex-row md:items-center">
        <h1 className="flex items-center justify-center gap-x-3 p-3 text-5xl font-bold md:p-5">
          {todoList.name}{" "}
          <span>
            <NotepadText className="size-10" />
          </span>
        </h1>
        {/* btns */}
        <div className="flex w-full max-w-fit items-center justify-center gap-3 p-3 md:p-5">
          <Link
            href={"/"}
            className="rounded-lg bg-green-300 px-4 py-2 text-lg font-medium duration-100 ease-in hover:scale-105"
          >
            <House />
          </Link>
          <button
            onClick={() => handleDeleteTodoList(todo)}
            className="rounded-lg bg-red-300 px-4 py-2 text-lg font-medium duration-100 ease-in hover:scale-105"
          >
            <Trash2 />
          </button>
          <div className="w-full md:hidden">
            <button
              onClick={() => setFormVisible(!formVisible)}
              className="rounded-lg bg-blue-300 px-4 py-2 text-lg font-medium duration-100 ease-in hover:scale-105"
            >
              {formVisible ? "Hide Form" : "Show Form"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-5 flex w-full max-w-7xl flex-col gap-2 md:mt-10 md:flex-row md:gap-5 lg:mt-16 lg:gap-10">
        <div
          className={`transition-all duration-700 ease-in-out ${
            formVisible
              ? "max-h-screen opacity-100"
              : "max-h-0 overflow-hidden opacity-0"
          }`}
        >
          <CreateNewTodoForm
            todoListId={todoList.id}
            onTodoCreatedOrUpdated={handleTodoCreatedOrUpdated}
            editingTodo={editingTodo}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </div>
        <div className="flex w-full flex-col p-3 md:p-5">
          {/* filter wrapper */}
          <div className="flex items-center justify-start gap-5">
            {/* status filter */}
            <div className="mb-4">
              <label htmlFor="filter" className="mr-2">
                Status:
              </label>
              <select
                id="filter"
                value={filter}
                onChange={handleFilterChange}
                className="rounded border border-gray-300 px-2 py-1"
              >
                <option value="all">All</option>
                <option value="done">Done</option>
                <option value="todo">Todo</option>
              </select>
            </div>
            {/* priority filter */}
            <div className="mb-4">
              <label htmlFor="priority-filter" className="mr-2">
                Priority:
              </label>
              <select
                id="priority-filter"
                value={priorityFilter}
                onChange={handlePriorityFilterChange}
                className="rounded border border-gray-300 px-2 py-1"
              >
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          {sortedTodos.length === 0 ? (
            <div className="mb-16 flex h-full items-center justify-center text-xl font-bold md:text-3xl lg:text-5xl">
              No todos listed.{" "}
            </div>
          ) : (
            <ul className="mb-16">
              {sortedTodos.map((todo) => (
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
