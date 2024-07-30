import { Todo } from '@/types/todos';
import { Pencil, Trash2 } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggleCompleted: (todoId: string, completed: boolean) => void;
  onDeleteTodo: (todoId: string) => void;
  onEditTodo: (todo: Todo) => void;
  loadingNewTodo: boolean;
}

const TodoItem = ({
  todo,
  onToggleCompleted,
  onDeleteTodo,
  onEditTodo,
  loadingNewTodo,
}: TodoItemProps) => {
  return (
    <li className='border-b border-gray-500 p-4'>
      {loadingNewTodo && (
        <div className='animate-pulse bg-gray-200 h-6'>
          Creating new Todo...
        </div>
      )}
      {!loadingNewTodo && (
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              checked={todo.completed}
              onChange={() => onToggleCompleted(todo.id, !todo.completed)}
              className='size-5 hover:cursor-pointer'
            />
            <div>
              <div
                className={`text-lg font-medium ${
                  todo.completed ? 'line-through text-gray-400' : ''
                }`}
              >
                {todo.name}
              </div>
              <div className='text-sm text-gray-600'>
                Priority: {todo.priority} - Due:{' '}
                {todo.dueDate
                  ? new Date(todo.dueDate).toLocaleDateString('en-GB')
                  : 'No due date'}
              </div>
              <div className='text-sm text-gray-600'>
                Tags: {todo.tags.join(', ')}
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => onEditTodo(todo)}
              className='text-blue-500 hover:text-blue-700'
            >
              <Pencil />
            </button>
            <button
              onClick={() => onDeleteTodo(todo.id)}
              className='text-red-500 hover:text-red-700'
            >
              <Trash2 />
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default TodoItem;