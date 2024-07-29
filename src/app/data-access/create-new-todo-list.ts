'use server';

import { db } from '@/db/db';
import { todoListSchema } from '@/utils/validation';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type CreateNewTodoListError = {
  name?: string[];
};

export async function createNewTodoList(
  name: string
): Promise<{ error?: CreateNewTodoListError }> {
  const validation = todoListSchema.safeParse({ name });
  if (!validation.success) {
    const errors = validation.error.format();
    return { error: { name: errors.name as unknown as string[] } };
  }

  const existingTodoList = await db.todoList.findUnique({
    where: { name },
  });

  if (existingTodoList) {
    return { error: { name: ['A TodoList with this name already exists'] } };
  }

  await db.todoList.create({
    data: {
      name,
    },
  });

  const todoListId = await db.todoList.findFirst({
    where: {
      name,
    },
  });

  if (todoListId) {
    revalidatePath(`/${todoListId.id}`);
    redirect(`/${todoListId.id}`);
  }

  return {};
}
