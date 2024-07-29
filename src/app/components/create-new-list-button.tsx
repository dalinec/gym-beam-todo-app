'use client';
import React, { useState } from 'react';
import Modal from './create-new-list-modal';

const CreateNewListButton = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <div>
      <button
        onClick={handleOpenModal}
        className='px-4 py-2 bg-blue-500 text-white rounded'
      >
        Create New List
      </button>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default CreateNewListButton;
