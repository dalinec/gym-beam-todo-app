'use client';

import React, { useState } from 'react';
import { createNewTodoList } from '../data-access/create-new-todo-list';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal = ({ isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;

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
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget as HTMLFormElement;
            const fomrData = new FormData(form);
            const name = fomrData.get('name') as string;

            await createNewTodoList(name);
          }}
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
