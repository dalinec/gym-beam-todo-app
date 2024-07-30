"use server";

import { db } from "@/db/db";
import { revalidatePath } from "next/cache";

export async function deleteTodo(todoId: string) {
  try {
    await db.todo.delete({
      where: {
        id: todoId,
      },
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
  revalidatePath("/", "page");
}
