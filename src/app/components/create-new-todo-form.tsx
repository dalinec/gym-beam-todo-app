'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Todo } from '@/types/todos';

interface CreateNewTodoFormProps {
  todoListId: string;
  onTodoCreatedOrUpdated: (newTodoId?: string) => void;
  editingTodo?: Todo | null;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

const CreateNewTodoForm = ({
  todoListId,
  onTodoCreatedOrUpdated,
  editingTodo,
  isEditing,
  setIsEditing,
}: CreateNewTodoFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    completed: false,
    priority: 1,
    dueDate: '' as string,
    tags: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && editingTodo) {
      setFormData({
        name: editingTodo.name,
        completed: editingTodo.completed,
        priority: editingTodo.priority,
        dueDate: editingTodo.dueDate
          ? new Date(editingTodo.dueDate).toISOString().split('T')[0]
          : '',
        tags: editingTodo.tags,
      });
    } else {
      resetForm();
    }
  }, [isEditing, editingTodo]);

  const resetForm = () => {
    setFormData({
      name: '',
      completed: false,
      priority: 1,
      dueDate: '',
      tags: [],
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      tags: e.target.value.split(',').map((tag) => tag.trim()),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const newTodo = {
      name: formData.name,
      completed: formData.completed,
      priority: formData.priority,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      tags: formData.tags,
    };

    try {
      if (isEditing && editingTodo) {
        const response = await fetch('/api/update-todo', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingTodo.id,
            updatedTodo: newTodo,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update todo`);
        }

        const result = await response.json();
        onTodoCreatedOrUpdated(result.id);
        resetForm();
        setIsEditing(false);
      } else {
        const response = await fetch('/api/create-todo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newTodo,
            todoListId,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to create todo`);
        }

        const result = await response.json();
        onTodoCreatedOrUpdated(result.id); // Pass ID of created todo
        resetForm();
      }
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
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
        <label htmlFor='completed'>Completed</label>
        <select
          name='completed'
          id='completed'
          value={formData.completed.toString()}
          onChange={handleChange}
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
          value={formData.priority}
          onChange={handleChange}
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
          value={formData.dueDate}
          onChange={handleChange}
          disabled={isSubmitting}
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
          value={formData.tags.join(', ')}
          onChange={handleTagsChange}
          disabled={isSubmitting}
        />
        <button
          type='submit'
          className={`justify-self-start border border-red-200 max-w-fit px-2 py-1 rounded-sm flex ${
            isSubmitting ? 'bg-gray-300 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Submitting...'
            : isEditing
            ? 'Update Todo'
            : 'Create Todo'}
        </button>
        {error && <p className='text-red-500'>{error}</p>}
      </div>
    </form>
  );
};

export default CreateNewTodoForm;
