import { Link } from "react-router-dom";
//import "./Sidebar.css"; // Import CSS for styling

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        <li><Link to="/reports">Reports</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
