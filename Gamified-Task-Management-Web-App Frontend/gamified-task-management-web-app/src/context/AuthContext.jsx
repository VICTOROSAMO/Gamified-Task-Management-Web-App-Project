import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password,
      });
      const { data } = response;
      setToken(data);
      localStorage.setItem("token", data);
      setUser(username);
    } catch (error) {
      console.error("Login failed:", error.response?.data);
      throw error;
    }
  };

  const signup = async (username, password, email) => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/signup", {
        username,
        password,
        email,
      });
      return response.data;
    } catch (error) {
      console.error("Signup failed:", error.response?.data);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);