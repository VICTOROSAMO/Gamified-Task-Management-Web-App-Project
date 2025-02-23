import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");

  // Function to fetch tasks from Firestore
  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    setTasks(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  // Fetch tasks when component loads
  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to add a task
  const addTask = async () => {
    if (!taskName.trim()) return;
    await addDoc(collection(db, "tasks"), { name: taskName });
    setTaskName(""); // Clear input field
    fetchTasks(); // Refresh tasks list
  };

  return (
    <div>
      <h2>Task Management</h2>
      <input
        type="text"
        placeholder="Enter Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
