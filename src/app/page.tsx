import { db } from '@/db/db';

export default async function Home() {
  const allTodoLists = await db.todoList.findMany({
    include: {
      todos: true,
    },
  });

  console.log(allTodoLists);

  return (
    <main className='flex min-h-screen flex-col gap-10 items-center justify-start p-12'>
      <h1>Hello</h1>
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
