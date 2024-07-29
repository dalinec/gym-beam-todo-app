import { db } from '@/db/db';
import CreateNewListButton from './components/create-new-list-button';
import Link from 'next/link';
import { formatNameForUrl } from '@/utils/utils';

export default async function Home() {
  const allTodoLists = await db.todoList.findMany({
    include: {
      todos: true,
    },
  });
  return (
    <main className='flex min-h-screen w-full max-w-7xl mx-auto flex-col gap-10 items-center justify-start p-12'>
      <div className='flex w-full justify-between'>
        <h1>Hello</h1>
        <CreateNewListButton />
      </div>
      <div className='grid grid-cols-1 w-full border md:grid-cols-2 lg:grid-cols-4 gap-5'>
        {allTodoLists.map((todoList, i) => (
          <Link
            className='hover:scale-105 ease-out duration-100'
            key={i}
            href={`/${formatNameForUrl(todoList.name)}`}
          >
            <div className='p-6 border min-h-[200px] border-slate-300 rounded-lg'>
              <h2 className='mb-2'>{todoList.name}</h2>
              <ul>
                {todoList.todos.map((todo, i) => (
                  <li key={i}>-{todo.name}</li>
                ))}
              </ul>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
