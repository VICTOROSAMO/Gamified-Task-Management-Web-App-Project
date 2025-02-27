import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TaskForm from "../components/Task/TaskForm";
import { useTask } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import { Timestamp } from "firebase/firestore"; 
import { Task } from "../types/Task"; // 🔹 Import Task type
import "./Dashboard.css";

const Dashboard = () => {
  const { tasks, updateTaskStatus, deleteTask } = useTask();
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  const [weeklyReport, setWeeklyReport] = useState({ completed: 0, pending: 0 });

  // 🔹 Filter only pending tasks
  const pendingTasks = tasks.filter((task) => task.status === "pending");

  // Calculate Task Statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;

  // Calculate Points (Each completed task = 10 points)
  useEffect(() => {
    setPoints(completedTasks * 10);
  }, [completedTasks]);

  // Calculate Streak (Consecutive days completing tasks)
  useEffect(() => {
    const completedToday = tasks.some((task) => {
      let taskDate;
      if (task.createdAt instanceof Timestamp) {
        taskDate = task.createdAt.toDate();
      } else if (typeof task.createdAt === "number") {
        taskDate = new Date(task.createdAt);
      } else {
        return false;
      }

      return task.status === "completed" && taskDate.toDateString() === new Date().toDateString();
    });

    setStreak(completedToday ? streak + 1 : 0);
  }, [tasks]);

  // Identify Upcoming & Overdue Tasks
  useEffect(() => {
    const now = new Date();

    const upcoming = tasks.filter((task) => {
      if (!task.dueDate) return false;

      let dueDate: Date;
      if (task.dueDate instanceof Timestamp) {
        dueDate = task.dueDate.toDate();
      } else if (typeof task.dueDate === "number") {
        dueDate = new Date(task.dueDate);
      } else {
        return false;
      }

      return dueDate > now && dueDate <= new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // Due in 3 days
    });

    const overdue = tasks.filter((task) => {
      if (!task.dueDate) return false;

      let dueDate;
      if (task.dueDate instanceof Timestamp) {
        dueDate = task.dueDate.toDate();
      } else if (typeof task.dueDate === "number") {
        dueDate = new Date(task.dueDate);
      } else {
        return false;
      }

      return dueDate < now && task.status !== "completed";
    });

    setUpcomingTasks(upcoming);
    setOverdueTasks(overdue);
  }, [tasks]);

  // Generate Weekly Progress Report
  useEffect(() => {
    const pastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const completedThisWeek = tasks.filter((task) => {
      let taskDate;

      if (task.createdAt instanceof Timestamp) {
        taskDate = task.createdAt.toDate();
      } else if (typeof task.createdAt === "number") {
        taskDate = new Date(task.createdAt);
      } else {
        return false;
      }

      return task.status === "completed" && taskDate >= pastWeek;
    }).length;

    setWeeklyReport({ completed: completedThisWeek, pending: pendingTasks.length });
  }, [tasks]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <main className="main-content">
          <h1>Dashboard</h1>
          <TaskForm />

          {/* Task Summary */}
          <div className="task-summary">
            <p>Total Tasks: {totalTasks}</p>
            <p>Completed: {completedTasks}</p>
            <p>Pending: {pendingTasks.length}</p>
            <p>Points: {points} 🏆</p>
            <p>Streak: {streak} 🔥</p>
          </div>

          {/* 🔹 Display Pending Tasks */}
          <div className="task-list">
            <h2>Pending Tasks</h2>
            {pendingTasks.length > 0 ? (
              <ul>
                {pendingTasks.map((task) => (
                  <li key={task.id} className="task-item">
                    <strong>{task.title}</strong> - {task.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No pending tasks.</p>
            )}
          </div>

          {/* Notifications & Reminders */}
          <div className="notifications">
            {upcomingTasks.length > 0 && (
              <div className="upcoming-tasks">
                <h3>Upcoming Tasks 📅</h3>
                <ul>
                  {upcomingTasks.map((task) => {
                    const dueDate =
                      task.dueDate instanceof Timestamp
                        ? task.dueDate.toDate()
                        : typeof task.dueDate === "number"
                        ? new Date(task.dueDate)
                        : null;

                    return (
                      <li key={task.id}>
                        {task.title} - Due {dueDate ? dueDate.toDateString() : "No Due Date"}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Weekly Progress Report */}
          <div className="weekly-report">
            <h3>Weekly Progress Report 📊</h3>
            <p>Completed Tasks: {weeklyReport.completed}</p>
            <p>Pending Tasks: {weeklyReport.pending}</p>
          </div>

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
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
