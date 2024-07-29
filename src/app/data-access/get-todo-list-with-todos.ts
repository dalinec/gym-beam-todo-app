'use server';

import { db } from '@/db/db';

export async function getTodoListWithTodos(id: string) {
  const todoList = await db.todoList.findUnique({
    where: { id },
    include: { todos: true },
  });

  return todoList;
}
