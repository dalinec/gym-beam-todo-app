'use server';

import { db } from '@/db/db';

interface NewTodo {
  name: string;
  completed: boolean;
  priority: number;
  dueDate: Date | null;
  tags: string[];
}

export async function updateTodo(id: string, newTodo: NewTodo) {
  const todo = await db.todo.findUnique({
    where: { id },
  });

  if (todo) {
    const updatedTodo = await db.todo.update({
      where: { id },
      data: { ...newTodo },
    });
    return updatedTodo;
  } else {
    console.error('No todo with the provided id found.');
  }
}
