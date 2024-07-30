"use client";

import {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  startTransition,
} from "react";
import { Todo } from "@/types/todos";
import { useRouter } from "next/navigation";

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
    name: "",
    completed: false,
    priority: "low",
    dueDate: "" as string,
    tags: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isEditing && editingTodo) {
      setFormData({
        name: editingTodo.name,
        completed: editingTodo.completed,
        priority: editingTodo.priority,
        dueDate: editingTodo.dueDate
          ? new Date(editingTodo.dueDate).toISOString().split("T")[0]
          : "",
        tags: editingTodo.tags,
      });
    } else {
      resetForm();
    }
  }, [isEditing, editingTodo]);

  const resetForm = () => {
    setFormData({
      name: "",
      completed: false,
      priority: "low",
      dueDate: "",
      tags: [],
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else if (name === "completed") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value === "true",
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
      tags: e.target.value.split(",").map((tag) => tag.trim()),
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
        const response = await fetch("/api/update-todo", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
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
        const response = await fetch("/api/create-todo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
        onTodoCreatedOrUpdated(result.id);
        resetForm();
      }
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
      startTransition(() => {
        router.refresh();
      });
    }
  };

  return (
    <form
      className="w-full p-3 md:max-w-[400px] md:p-5"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-3 rounded-lg border border-gray-500 p-5">
        <h2 className="font-bold">
          {isEditing ? "Edit Todo" : "Create New Todo"}
        </h2>
        <label htmlFor="name">Name of the Todo</label>
        <input
          className={`rounded-md border border-gray-500 px-2 py-1 ${
            isSubmitting ? "bg-gray-200" : ""
          }`}
          type="text"
          name="name"
          id="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
        <label htmlFor="completed">Completed</label>
        <select
          name="completed"
          id="completed"
          value={formData.completed.toString()}
          onChange={handleChange}
          disabled={isSubmitting}
          className={`rounded-md border border-gray-500 px-2 py-1 ${
            isSubmitting ? "bg-gray-200" : ""
          }`}
        >
          <option value="false">Not Completed</option>
          <option value="true">Completed</option>
        </select>
        <label>Priority</label>
        <div className="flex items-center justify-around gap-3">
          <input
            type="radio"
            name="priority"
            value="high"
            id="high"
            checked={formData.priority === "high"}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <label className="radio-label radio-label-high" htmlFor="high">
            High
          </label>
          <input
            type="radio"
            name="priority"
            value="medium"
            id="medium"
            checked={formData.priority === "medium"}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <label className="radio-label radio-label-medium" htmlFor="medium">
            Medium
          </label>
          <input
            type="radio"
            name="priority"
            value="low"
            id="low"
            checked={formData.priority === "low"}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <label className="radio-label radio-label-low" htmlFor="low">
            Low
          </label>
        </div>
        <label htmlFor="dueDate">Due Date</label>
        <input
          className={`rounded-md border border-gray-500 px-2 py-1 ${
            isSubmitting ? "bg-gray-200" : ""
          }`}
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />
        <label htmlFor="tags">Tags (comma separated)</label>
        <input
          className={`rounded-md border border-gray-500 px-2 py-1 ${
            isSubmitting ? "bg-gray-200" : ""
          }`}
          type="text"
          name="tags"
          id="tags"
          placeholder="Tags"
          value={formData.tags.join(",")}
          onChange={handleTagsChange}
          disabled={isSubmitting}
        />
        <div
          className={`${isEditing ? "mt-3 flex items-center justify-between" : "mt-3"}`}
        >
          <button
            type="submit"
            className={`flex max-w-fit justify-self-start rounded-lg border bg-blue-500 px-2 py-1 text-white duration-75 ease-out hover:scale-[103%] ${
              isSubmitting ? "cursor-not-allowed bg-gray-300" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Submitting..."
              : isEditing
                ? "Update Todo"
                : "Create Todo"}
          </button>
          {isEditing && (
            <button
              onClick={() => setIsEditing(false)}
              className="flex max-w-fit justify-self-start rounded-lg border bg-blue-500 px-2 py-1 text-white duration-75 ease-out hover:scale-[103%]"
            >
              Create Todo
            </button>
          )}
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </form>
  );
};

export default CreateNewTodoForm;
