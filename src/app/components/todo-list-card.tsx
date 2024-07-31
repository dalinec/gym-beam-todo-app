import Link from "next/link";
import React from "react";
import { TodoList } from "@/types/todos";
import { ChevronRight } from "lucide-react";

const TodoListCard = (todoList: TodoList) => {
  return (
    <Link
      className="duration-100 ease-out hover:scale-105"
      href={`/${todoList.id}`}
    >
      <div className="min-h-[200px] rounded-lg border todolistBorder border-blue-500 bg-slate-100 p-6 shadow-md">
        <h2 className="mb-2 font-semibold">{todoList.name}</h2>
        <ul>
          {todoList.todos.slice(0, 4).map((todo, j) => (
            <li className="flex items-center justify-start" key={j}>
              <ChevronRight className="size-4" />
              {todo.name}
            </li>
          ))}
          {todoList.todos.length > 4 && (
            <li>
              {todoList.todos.length - 4 === 1
                ? `+1 more todo`
                : `+${todoList.todos.length - 4} more todos`}
            </li>
          )}
        </ul>
      </div>
    </Link>
  );
};

export default TodoListCard;
