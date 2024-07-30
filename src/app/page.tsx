import { db } from "@/db/db";
import CreateNewListButton from "./components/create-new-list-button";
import Link from "next/link";
import { ChevronRight, NotepadText } from "lucide-react";

export default async function Home() {
  const allTodolists = await db.todoList.findMany({
    include: {
      todos: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const maxVisibleItems = 4;
  const hasMoreItems = allTodolists.length > maxVisibleItems;
  const visibleTodolists = allTodolists.slice(0, maxVisibleItems);
  const moreItemsCount = allTodolists.length - maxVisibleItems;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-start gap-10 p-5 md:p-10">
      <div className="flex w-full flex-col justify-between gap-5 py-3 md:flex-row md:py-5">
        <h1 className="flex items-center justify-start gap-x-3 text-5xl font-semibold md:justify-center">
          Todo lists{" "}
          <span>
            <NotepadText className="size-10" />
          </span>
        </h1>
        <CreateNewListButton />
      </div>
      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {visibleTodolists.map((todoList, i) => (
          <Link
            className="duration-100 ease-out hover:scale-105"
            key={i}
            href={`/${todoList.id}`}
          >
            <div className="min-h-[200px] rounded-lg border border-blue-500 bg-slate-100 p-6 shadow-md">
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
        ))}
        {hasMoreItems && (
          <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-slate-300 p-6 text-center">
            <p>
              {moreItemsCount === 1
                ? `+1 more todo list`
                : `+${moreItemsCount} more todo lists`}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
