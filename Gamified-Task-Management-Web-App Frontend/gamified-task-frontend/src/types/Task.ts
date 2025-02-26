import { Timestamp } from "firebase/firestore";

export interface Task {
  id: string; // 🔹 Ensure it's always a string
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  createdAt: number | Timestamp; // 🔹 Firestore Timestamp or Unix timestamp
  dueDate?: number | Timestamp; // 🔹 Optional due date field
  userId: string;
}

