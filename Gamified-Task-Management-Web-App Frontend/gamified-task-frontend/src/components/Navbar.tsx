import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
//import "./Navbar.css"; // Import CSS for styling

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2>Welcome, {user?.email || "User"}!</h2>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </nav>
  );
};

export default Navbar;
