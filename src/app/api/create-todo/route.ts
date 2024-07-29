import { createNewTodo } from '@/app/data-access/create-new-todo';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { todoListId, newTodo } = body;

    const todo = await createNewTodo(todoListId, newTodo);

    return NextResponse.json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
