import axios from "axios";

const API_BASE_URL = "http://localhost:8080"; // Spring Boot backend URL

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface AuthResponse {
  token: string;
}

export interface UserData {
  username: string;
  password: string;
}

export const registerUser = (userData: UserData) => api.post("/auth/register", userData);
export const loginUser = (loginData: UserData) => api.post<AuthResponse>("/auth/login", loginData);
