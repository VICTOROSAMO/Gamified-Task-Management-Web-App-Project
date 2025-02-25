import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TaskForm from "../components/Task/TaskForm";
import { useTask } from "../context/TaskContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { tasks, updateTaskStatus, deleteTask } = useTask();
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Filter tasks based on status
  const filteredTasks = tasks.filter((task) =>
    filter === "all" ? true : task.status === filter
  );

  // Sort tasks by date
  const sortedTasks = [...filteredTasks].sort((a, b) =>
    sortBy === "newest" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
  );

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          <h1>Dashboard</h1>
          <TaskForm />

          {/* Filters & Sorting */}
          <div className="filters">
            <select onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In-Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          {/* Task List */}
          <h2>Your Tasks</h2>
          <ul className="task-list">
            {sortedTasks.length > 0 ? (
              sortedTasks.map((task) => (
                <li key={task.id} className={`task-item ${task.status}`}>
                  <strong>{task.title}</strong> - {task.description}
                  <div className="task-actions">
                    {task.status !== "completed" && (
                      <button onClick={() => updateTaskStatus(task.id, "completed")}>
                        ✔ Complete
                      </button>
                    )}
                    <button onClick={() => deleteTask(task.id)}>🗑 Delete</button>
                  </div>
                </li>
              ))
            ) : (
              <p>No tasks found.</p>
            )}
          </ul>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
