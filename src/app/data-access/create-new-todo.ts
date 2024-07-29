'use server';

import { db } from '@/db/db';
import { revalidatePath } from 'next/cache';

interface NewTodo {
  name: string;
  completed: boolean;
  priority: number;
  dueDate: Date | null;
  tags: string[];
}

export async function createNewTodo(todoListId: string, newTodo: NewTodo) {
  try {
    const todoList = await db.todoList.findUnique({
      where: {
        id: todoListId,
      },
    });

    if (!todoList) {
      throw new Error(`TodoList with id ${todoListId} not found`);
    }

    const createdTodo = await db.todo.create({
      data: {
        ...newTodo,
        todoListId: todoListId,
      },
    });

    revalidatePath(`/${todoListId}`, 'page');

    return createdTodo;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
}
