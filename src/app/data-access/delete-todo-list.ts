"use server";
import { db } from "@/db/db";
import { redirect } from "next/navigation";

export async function deleteTodoList(todoListId: string) {
  try {
    await db.todoList.delete({
      where: {
        id: todoListId,
      },
    });
  } catch (error) {
    console.error("Failed to delete the todolist.");
  }

  redirect("/");
}
