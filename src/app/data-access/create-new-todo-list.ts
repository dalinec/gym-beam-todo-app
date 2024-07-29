'use server';

import { db } from '@/db/db';
import { formatNameForUrl } from '@/utils/utils';
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

  const formatedName = formatNameForUrl(name);
  await db.todoList.create({
    data: {
      name,
    },
  });

  revalidatePath('/');
  redirect(`/${formatedName}`);
  return {};
}
