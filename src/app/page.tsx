import { db } from '@/db/db';
import CreateNewListButton from './components/create-new-list';

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
      <div className='flex flex-col gap-5'>
        {allTodoLists.map((todoList, i) => (
          <div key={i}>
            <h2 className='mb-2'>{todoList.name}</h2>
            <ul>
              {todoList.todos.map((todo, i) => (
                <li key={i}>-{todo.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
