'use client';

import React, { useState } from 'react';
import { createNewTodoList } from '../data-access/create-new-todo-list';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal = ({ isOpen, onClose }: ModalProps) => {
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get('name') as string;

    const result = await createNewTodoList(name);

    if (result.error) {
      setError(result.error.name ? result.error.name[0] : 'An error occurred');
    } else {
      setError(null);
      onClose();
    }
  };

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white relative p-6 rounded-lg shadow-lg w-full max-w-md'>
        <button
          onClick={onClose}
          className='absolute top-2 right-2 text-gray-600 hover:text-gray-800'
        >
          &times;
        </button>
        <form
          className='flex flex-col gap-10 items-center justify-center'
          onSubmit={handleSubmit}
        >
          <div className='flex flex-col gap-3 border border-green-300 rounded-lg p-5'>
            <label htmlFor='name'>Name of the List</label>
            <input
              className='border border-green-300 px-2 py-1'
              type='text'
              name='name'
              id='name'
              placeholder='Name'
            />
            <button
              type='submit'
              className='justify-self-start border border-red-200 max-w-fit px-2 py-1 rounded-sm flex'
            >
              Submit
            </button>
            {error && <p className='text-red-500 mt-2'>{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
