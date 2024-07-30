'use server';

import { db } from '@/db/db';

export async function deleteTodo(todoId: string) {
  try {
    await db.todo.delete({
      where: {
        id: todoId,
      },
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
}
