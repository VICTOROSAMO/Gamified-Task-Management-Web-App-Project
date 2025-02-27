import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TaskProvider } from "./context/TaskContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./components/Auth/login";
import Signup from "./components/Auth/signup";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          {/* ✅ Navbar should be here to avoid multiple instances */}
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<h1>Home</h1>} />
          </Routes>
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
