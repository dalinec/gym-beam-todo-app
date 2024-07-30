'use server';
import { db } from '@/db/db';

export async function updateTodoCompleted(todoId: string, completed: boolean) {
  await db.todo.update({
    where: {
      id: todoId,
    },
    data: { completed },
  });
}
