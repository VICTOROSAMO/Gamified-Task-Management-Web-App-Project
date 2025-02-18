import { createContext, useState, useContext, ReactNode } from "react";
import { loginUser, registerUser, UserData } from "../services/api";

interface AuthContextType {
  user: string | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token") || null);

  const login = async (username: string, password: string) => {
    try {
      const response = await loginUser({ username, password });
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      setUser(username);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const signup = async (username: string, password: string) => {
    try {
      await registerUser({ username, password });
      alert("Signup successful! Please login.");
    } catch (error) {
      alert("Signup failed.");
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
