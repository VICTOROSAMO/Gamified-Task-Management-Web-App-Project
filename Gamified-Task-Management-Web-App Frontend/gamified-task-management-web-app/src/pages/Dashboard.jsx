import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      {user && <p>Welcome, {user}!</p>}
    </div>
  );
};

export default Dashboard;