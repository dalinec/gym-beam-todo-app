'use client';

import { useState } from 'react';

interface CreateNewTodoFormProps {
  todoListId: string;
  onTodoCreated: (newTodoId: string) => void;
}

const CreateNewTodoForm = ({
  todoListId,
  onTodoCreated,
}: CreateNewTodoFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const newTodo = {
      name: formData.get('name') as string,
      completed: formData.get('completed') === 'true',
      priority: parseInt(formData.get('priority') as string, 10),
      dueDate: formData.get('dueDate')
        ? new Date(formData.get('dueDate') as string)
        : null,
      tags: (formData.get('tags') as string)
        .split(',')
        .map((tag) => tag.trim()),
    };

    try {
      const response = await fetch('/api/create-todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newTodo, todoListId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create todo');
      }

      const createdTodo = await response.json();
      console.log('Todo created:', createdTodo);

      onTodoCreated(createdTodo.id);

      form.querySelectorAll('input, select').forEach((input) => {
        (input as HTMLInputElement).value = '';
      });
    } catch (error) {
      console.error(error);
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className='w-full md:max-w-[400px] p-3 md:p-5'
      onSubmit={handleSubmit}
    >
      <div className='flex flex-col gap-3 border border-green-300 rounded-lg p-5'>
        <label htmlFor='name'>Name of the Todo</label>
        <input
          className={`border border-green-300 px-2 py-1 ${
            isSubmitting ? 'bg-gray-200' : ''
          }`}
          type='text'
          name='name'
          id='name'
          placeholder='Name'
          required
          disabled={isSubmitting}
        />
        <label htmlFor='completed'>Completed</label>
        <select
          name='completed'
          id='completed'
          disabled={isSubmitting}
          className={`border border-green-300 px-2 py-1 ${
            isSubmitting ? 'bg-gray-200' : ''
          }`}
        >
          <option value='false'>Not Completed</option>
          <option value='true'>Completed</option>
        </select>
        <label htmlFor='priority'>Priority</label>
        <input
          className={`border border-green-300 px-2 py-1 ${
            isSubmitting ? 'bg-gray-200' : ''
          }`}
          type='number'
          name='priority'
          id='priority'
          placeholder='Priority'
          required
          disabled={isSubmitting}
        />
        <label htmlFor='dueDate'>Due Date</label>
        <input
          className={`border border-green-300 px-2 py-1 ${
            isSubmitting ? 'bg-gray-200' : ''
          }`}
          type='date'
          name='dueDate'
          disabled={isSubmitting}
          required
        />
        <label htmlFor='tags'>Tags (comma separated)</label>
        <input
          className={`border border-green-300 px-2 py-1 ${
            isSubmitting ? 'bg-gray-200' : ''
          }`}
          type='text'
          name='tags'
          id='tags'
          placeholder='Tags'
          disabled={isSubmitting}
        />
        <button
          type='submit'
          className={`justify-self-start border border-red-200 max-w-fit px-2 py-1 rounded-sm flex ${
            isSubmitting ? 'bg-gray-300 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        {error && <p className='text-red-500'>{error}</p>}
      </div>
    </form>
  );
};

export default CreateNewTodoForm;
