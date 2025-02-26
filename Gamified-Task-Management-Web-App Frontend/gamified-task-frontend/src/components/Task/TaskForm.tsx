import { useState } from "react";
import { useTask } from "../../context/TaskContext";

const TaskForm = () => {
  const { createTask } = useTask();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;
  
    await createTask(title, description, new Date(dueDate)); // 🔹 Pass `dueDate` to createTask
    setTitle("");
    setDescription("");
    setDueDate("");
  };
  

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
