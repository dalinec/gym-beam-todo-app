'use server';

import { db } from '@/db/db';
import { formatNameForUrl } from '@/utils/utils';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createNewTodoList(name: string) {
  const formatedName = formatNameForUrl(name);
  await db.todoList.create({
    data: {
      name,
    },
  });
  revalidatePath('/');
  redirect(`/${formatedName}`);
}
