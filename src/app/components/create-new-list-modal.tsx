"use client";

import React, { useState } from "react";
import { createNewTodoList } from "../data-access/create-new-todo-list";

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
    const name = formData.get("name") as string;

    const result = await createNewTodoList(name);

    if (result?.error) {
      setError(result.error.name ? result.error.name[0] : "An error occurred");
    } else {
      setError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="relative rounded-lg bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-gray-600 hover:text-gray-800"
        >
          &times;
        </button>
        <form
          className="flex flex-col items-center justify-center gap-10"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-3 rounded-lg border border-gray-500 p-5">
            <label className="font-semibold" htmlFor="name">
              Name of the Todo List
            </label>
            <input
              className="rounded-md border border-gray-500 px-2 py-1"
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              required
            />
            <button
              type="submit"
              className="flex max-w-fit justify-self-start rounded-lg border bg-blue-500 px-3 py-1 text-white duration-75 ease-out hover:scale-[103%]"
            >
              Submit
            </button>
            {error && <p className="mt-2 text-red-500">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
