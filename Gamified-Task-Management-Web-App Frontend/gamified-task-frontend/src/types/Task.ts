import { Timestamp } from "firebase/firestore";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed"; // 🔹 Ensure status type is correct
  createdAt: Timestamp;
  dueDate?: Timestamp | null; // 🔹 Ensure dueDate can be null
  userId: string;
}


