"use client";
import React, { useState } from "react";
import Modal from "./create-new-list-modal";

const CreateNewListButton = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <div>
      <button
        onClick={handleOpenModal}
        className="rounded bg-blue-500 px-4 py-2 text-white duration-100 ease-in hover:scale-[103%]"
      >
        Create New List
      </button>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default CreateNewListButton;
