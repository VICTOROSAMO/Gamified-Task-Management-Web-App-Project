import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Auth/login";
import Signup from "./components/Auth/signup";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<h1>Home Page</h1>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;

