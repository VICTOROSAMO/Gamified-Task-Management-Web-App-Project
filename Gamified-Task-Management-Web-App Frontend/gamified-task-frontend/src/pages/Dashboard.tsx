import { useTask } from "../context/TaskContext";

const Dashboard = () => {
  const { tasks } = useTask();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      {/* Show tasks */}
      <ul>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id} className="p-2 bg-gray-200 my-2 rounded">
              <strong>{task.title}</strong> - {task.description}
            </li>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
