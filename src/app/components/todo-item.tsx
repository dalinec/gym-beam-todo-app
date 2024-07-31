import { Todo } from "@/types/todos";
import { Pencil, Trash2 } from "lucide-react";
import { CSSProperties } from "react";
import { HashLoader } from "react-spinners";

interface TodoItemProps {
  todo: Todo;
  onToggleCompleted: (todoId: string, completed: boolean) => void;
  onDeleteTodo: (todoId: string) => void;
  onEditTodo: (todo: Todo) => void;
  isLoading: boolean;
  loaderColor: string;
}

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  padding: "34px 0",
};

const TodoItem = ({
  todo,
  onToggleCompleted,
  onDeleteTodo,
  onEditTodo,
  isLoading,
  loaderColor,
}: TodoItemProps) => {
  return (
    <li
      className={`${isLoading ? "border-b-0" : "border-b"} border-gray-500 p-4`}
    >
      {isLoading && (
        <div className="flex h-full w-full flex-1">
          <HashLoader
            size={30}
            color={loaderColor}
            cssOverride={override}
            loading={isLoading}
          />
        </div>
      )}
      {!isLoading && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggleCompleted(todo.id, !todo.completed)}
              className="size-5 hover:cursor-pointer"
            />
            <div>
              <div
                className={`text-lg font-medium ${
                  todo.completed ? "text-gray-400 line-through" : ""
                }`}
              >
                {todo.name}
              </div>
              <div className="text-sm todoInfo text-gray-600">
                Priority:{" "}
                <span className={`priority-${todo.priority}`}>
                  {todo.priority}
                </span>{" "}
                <span className="inline-block">
                  <span> - </span>
                  Due:{" "}
                  <span className="font-semibold">
                    {todo.dueDate
                      ? new Date(todo.dueDate).toLocaleDateString("en-GB")
                      : "No due date"}
                  </span>
                </span>
              </div>
              <div className="max-w-[200px] todoTags truncate text-ellipsis text-sm text-gray-600 sm:max-w-full">
                {todo.tags.length === 1 && todo.tags.includes("") ? (
                  <span>No tags</span>
                ) : (
                  <span>
                    {" "}
                    <span className="font-medium underline">Tags:</span>{" "}
                    {todo.tags.join(", ")}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditTodo(todo)}
              className="text-blue-500 hover:text-blue-700"
            >
              <Pencil />
            </button>
            <button
              onClick={() => onDeleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 />
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default TodoItem;
